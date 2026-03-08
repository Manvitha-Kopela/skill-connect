import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

const courseCreateSchema = z.object({
  title: z.string().min(5),
  description: z.string().min(20),
  thumbnailUrl: z.string().url(),
  priceInCoins: z.number().min(0),
  level: z.string(),
  language: z.string(),
});

export async function POST(req: NextRequest) {
  const token = req.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { userId: string };
    const body = await req.json();
    const validatedData = courseCreateSchema.parse(body);

    const rewardAmount = 50;

    const result = await prisma.$transaction([
      prisma.course.create({
        data: {
          ...validatedData,
          instructorId: decoded.userId,
        },
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
          reason: 'Course Creation Reward',
        },
      }),
    ]);

    return NextResponse.json({ 
      message: 'Course created and reward earned!', 
      course: result[0],
      newBalance: result[1].coinBalance 
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: 'Invalid input', errors: error.errors }, { status: 400 });
    }
    console.error('Course creation error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}