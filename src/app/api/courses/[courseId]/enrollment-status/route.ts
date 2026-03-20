import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';

/**
 * Checks if the current user is enrolled in a specific course and returns progress.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  const { courseId } = await params;
  const token = req.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.json({ enrolled: false, progress: 0 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { userId: string };
    const userId = decoded.userId;

    if (!userId || !courseId) {
      return NextResponse.json({ enrolled: false, progress: 0 });
    }

    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    return NextResponse.json({ 
      enrolled: !!enrollment,
      progress: enrollment?.progress || 0
    });
  } catch (error) {
    console.error('Enrollment status check error:', error);
    return NextResponse.json({ enrolled: false, progress: 0 });
  }
}
