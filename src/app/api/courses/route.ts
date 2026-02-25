import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            role: true,
          }
        },
        modules: {
          include: {
            lessons: true,
          },
        },
      },
    });
    return NextResponse.json(courses || []);
  } catch (error: any) {
    console.error('Failed to fetch courses:', error);
    return NextResponse.json({ 
      message: 'Failed to fetch courses',
      detail: error.message 
    }, { status: 500 });
  }
}
