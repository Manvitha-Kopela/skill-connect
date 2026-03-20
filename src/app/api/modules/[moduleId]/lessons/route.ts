import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import * as jose from 'jose';

/**
 * @fileOverview Handles lesson creation for a specific module.
 */

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ moduleId: string }> }
) {
  const { moduleId } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key');
    const { payload } = await jose.jwtVerify(token, secret);
    const userId = payload.userId as string;

    // Verify module existence and ownership
    const module = await prisma.module.findUnique({
      where: { id: moduleId },
      include: { course: true }
    });

    if (!module) {
      return NextResponse.json({ message: 'Module not found' }, { status: 404 });
    }

    if (module.course.instructorId !== userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    const { title, description, videoUrl, duration } = await req.json();

    if (!title) {
      return NextResponse.json({ message: 'Lesson title is required' }, { status: 400 });
    }

    const count = await prisma.lesson.count({
      where: { moduleId }
    });

    const lesson = await prisma.lesson.create({
      data: {
        title,
        description: description || '',
        videoUrl: videoUrl || null,
        duration: duration || '0:00',
        moduleId,
        order: count + 1,
      }
    });

    return NextResponse.json(lesson, { status: 201 });
  } catch (error: any) {
    console.error('Lesson creation API error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
