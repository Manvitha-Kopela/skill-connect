import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const communities = await prisma.community.findMany({
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    // Returning raw array as expected by the existing frontend logic in src/app/communities/page.tsx
    return NextResponse.json(communities || []);
  } catch (error: any) {
    console.error('Error in /api/communities:', error);

    // Detect if table is missing
    if (error.code === 'P2021') {
      return NextResponse.json({ 
        message: 'Database tables are missing. Please run "npx prisma db push".',
        error: 'TABLE_NOT_FOUND'
      }, { status: 500 });
    }

    return NextResponse.json({ 
      message: 'Internal server error while fetching communities',
      error: error.message 
    }, { status: 500 });
  }
}
