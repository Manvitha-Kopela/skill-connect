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

    // Check if already rewarded for this specific course
    const existingReward = await prisma.coinTransaction.findFirst({
      where: {
        userId: decoded.userId,
        type: 'EARN',
        reason: 'Course Completion Reward',
        // In a real system, you might store metadata or a specific reference
        // For this MVP, we'll check the text which matches the logic
        createdAt: {
            gte: enrollment.createdAt
        }
      }
    });

    // Note: A more robust way would be to check a specific 'completedAt' field on enrollment
    if (enrollment.progress === 100 && existingReward) {
      return NextResponse.json({ message: 'Reward already claimed' }, { status: 400 });
    }

    const rewardAmount = 20;

    const result = await prisma.$transaction([
      prisma.enrollment.update({
        where: {
          userId_courseId: {
            userId: decoded.userId,
            courseId: courseId,
          },
        },
        data: { progress: 100 },
      }),
      prisma.user.update({
        where: { id: decoded.userId },
        data: {
          coinBalance: {
            increment: rewardAmount,
          },
        },
      }),
      prisma.coinTransaction.create({
        data: {
          userId: decoded.userId,
          amount: rewardAmount,
          type: 'EARN',
          reason: 'Course Completion Reward',
        },
      }),
    ]);

    return NextResponse.json({ 
      message: 'Congratulations! You earned completion coins.', 
      newBalance: result[1].coinBalance 
    });
  } catch (error: any) {
    console.error('Course completion reward error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}