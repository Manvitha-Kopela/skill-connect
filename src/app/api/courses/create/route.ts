import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { z } from 'zoc';

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
    return NextResponse.json({ 
      success: false, 
      message: 'Authentication required' 
    }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { userId: string };
    const body = await req.json();
    
    const parseResult = courseCreateSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid input data', 
        errors: parseResult.error.flatten().fieldErrors 
      }, { status: 400 });
    }

    const validatedData = parseResult.data;
    const rewardAmount = 50;

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user) {
      return NextResponse.json({ 
        success: false, 
        message: 'User account not found' 
      }, { status: 404 });
    }

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
      success: true,
      message: 'Course created and reward earned!', 
      course: result[0],
      newBalance: result[1].coinBalance 
    });
  } catch (error: any) {
    console.error('Course creation error detail:', error);
    
    let errorMessage = 'Internal Server Error during course creation';
    if (error.name === 'JsonWebTokenError') {
      errorMessage = 'Invalid authentication token';
      return NextResponse.json({ success: false, message: errorMessage }, { status: 401 });
    }

    return NextResponse.json({ 
      success: false, 
      message: error.message || errorMessage 
    }, { status: 500 });
  }
}
