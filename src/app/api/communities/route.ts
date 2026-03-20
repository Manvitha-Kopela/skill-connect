import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const communities = await prisma.community.findMany({
      include: {
        _count: {
          select: {
            discussions: true,
            members: true,
          }
        },
        members: {
          where: { role: 'ADMIN' },
          take: 1,
          select: { userId: true }
        },
        discussions: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
              }
            },
            _count: {
              select: { 
                comments: true,
                likes: true
              }
            }
          },
          orderBy: {
            id: 'desc'
          },
          take: 10
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    // Enrich community data with creatorId derived from the ADMIN member
    const enrichedCommunities = communities.map(community => ({
      ...community,
      creatorId: community.members[0]?.userId || null
    }));

    return NextResponse.json(enrichedCommunities || []);
  } catch (error: any) {
    console.error('Communities fetch error:', error);

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
