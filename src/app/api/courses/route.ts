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
            email: true,
          }
        },
        modules: {
          include: {
            lessons: true,
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      courses: courses || []
    });
  } catch (error: any) {
    console.error("Courses API error:", error);
    
    // Check if the error is due to missing tables
    if (error.code === 'P2021') {
      return NextResponse.json({ 
        success: false,
        message: 'Database tables are missing. Please run "npx prisma db push".',
        detail: error.message 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: false,
      message: 'Failed to fetch courses from database',
      detail: error.message 
    }, { status: 500 });
  }
}
