import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';

export async function POST(req: NextRequest) {
  const token = req.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { userId: string };
    const { courseId } = await req.json();

    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return NextResponse.json({ message: 'Course not found' }, { status: 404 });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Check if already enrolled
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: course.id,
        },
      },
    });

    if (existingEnrollment) {
      return NextResponse.json({ message: 'Already enrolled' }, { status: 400 });
    }

    // Check coins
    if (user.coinBalance < course.priceInCoins) {
      return NextResponse.json({ message: 'Insufficient coins' }, { status: 400 });
    }

    // Atomic transaction for enrollment and coin deduction
    const result = await prisma.$transaction([
      prisma.enrollment.create({
        data: {
          userId: user.id,
          courseId: course.id,
        },
      }),
      prisma.user.update({
        where: { id: user.id },
        data: {
          coinBalance: {
            decrement: course.priceInCoins,
          },
        },
      }),
      prisma.coinTransaction.create({
        data: {
          userId: user.id,
          amount: -course.priceInCoins,
          type: 'SPEND',
          reason: `Enrolled in course: ${course.title}`,
        },
      }),
    ]);

    return NextResponse.json({ message: 'Enrolled successfully', enrollment: result[0] });
  } catch (error: any) {
    console.error('Enrollment error:', error);
    return NextResponse.json({ message: 'Internal Server Error', detail: error.message }, { status: 500 });
  }
}
