import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';

/**
 * Enrollment route using path parameters.
 * Fixes the 500 error by simplifying the logic and improving error handling.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  const { courseId } = await params;
  const token = req.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
  }

  try {
    // 1. Extract userId from JWT
    let userId: string;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { userId: string };
      userId = decoded.userId;
    } catch (authError) {
      return NextResponse.json({ message: 'Invalid or expired session' }, { status: 401 });
    }

    if (!userId) {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
    }

    // 3. Validate courseId
    if (!courseId) {
      return NextResponse.json({ message: 'Course ID is required' }, { status: 400 });
    }

    // 4. Check if course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return NextResponse.json({ message: 'Course not found' }, { status: 404 });
    }

    // 5. Check if already enrolled using the composite unique key
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    if (existingEnrollment) {
      return NextResponse.json({ message: 'You are already enrolled in this course' }, { status: 400 });
    }

    // 7. Create enrollment record
    const enrollment = await prisma.enrollment.create({
      data: {
        userId,
        courseId,
        progress: 0,
      },
    });

    // 5. Return success response
    return NextResponse.json({ 
      success: true, 
      message: 'Successfully enrolled!', 
      enrollment 
    });

  } catch (error: any) {
    // 8. Log the REAL error
    console.error('Enrollment API error:', error);
    return NextResponse.json(
      { message: 'Enrollment failed' },
      { status: 500 }
    );
  }
}
