import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';

/**
 * @fileOverview Handles lesson completion and progress updates.
 */

export async function POST(req: NextRequest) {
  const token = req.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { userId: string };
    const { lessonId, courseId } = await req.json();

    if (!lessonId || !courseId) {
      return NextResponse.json({ message: 'Missing lessonId or courseId' }, { status: 400 });
    }

    // 1. Get total lessons in this course
    const totalLessons = await prisma.lesson.count({
      where: {
        module: {
          courseId: courseId
        }
      }
    });

    if (totalLessons === 0) {
      return NextResponse.json({ message: 'Course has no lessons' }, { status: 400 });
    }

    // 2. Find the current enrollment
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: decoded.userId,
          courseId: courseId,
        },
      },
    });

    if (!enrollment) {
      return NextResponse.json({ message: 'Not enrolled in this course' }, { status: 404 });
    }

    /**
     * Logic: We calculate progress as a percentage.
     * Since we don't have a specific LessonCompletion model (schema constraint),
     * we increment progress based on 1 / totalLessons.
     * Note: This implementation assumes linear progress.
     */
    const currentProgress = enrollment.progress;
    const increment = Math.ceil(100 / totalLessons);
    const newProgress = Math.min(100, currentProgress + increment);

    const updatedEnrollment = await prisma.enrollment.update({
      where: {
        userId_courseId: {
          userId: decoded.userId,
          courseId: courseId,
        },
      },
      data: {
        progress: newProgress,
      },
    });

    return NextResponse.json({ 
      success: true,
      message: 'Progress updated', 
      progress: updatedEnrollment.progress 
    });
  } catch (error: any) {
    console.error('Lesson completion error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
