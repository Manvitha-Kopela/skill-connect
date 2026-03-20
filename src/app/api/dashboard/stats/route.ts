import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';

/**
 * @fileOverview Dashboard stats API. 
 * Temporarily removed CoinTransaction queries to prevent Prisma errors while schema is being corrected.
 */

export async function GET(req: NextRequest) {
  const token = req.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { userId: string };
    const userId = decoded.userId;

    // Update lastSeenAt for activity tracking (User model field)
    await prisma.user.update({
      where: { id: userId },
      data: { lastSeenAt: new Date() }
    }).catch(() => {
      // Silence if field migration is pending
    });

    // 1. Fetch User basic stats
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        coinBalance: true,
        streak: true,
      }
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // 2. Fetch counts and lists using safe queries
    const [
      enrolledCoursesCount,
      joinedCommunitiesCount,
      rank,
      enrolledCourses,
      recentCommunities
    ] = await Promise.all([
      prisma.enrollment.count({ where: { userId } }),
      prisma.communityMember.count({ where: { userId } }),
      // Rank calculation based on User coinBalance (Safe)
      prisma.user.count({ where: { coinBalance: { gt: user.coinBalance } } }).then(c => c + 1),
      // List of courses for the progress bars
      prisma.enrollment.findMany({
        where: { userId },
        include: { course: true },
        take: 3
      }),
      // Communities for generating dummy activity if needed
      prisma.communityMember.findMany({
        where: { userId },
        include: {
          community: {
            include: {
              discussions: {
                orderBy: { id: 'desc' },
                take: 1
              }
            }
          }
        },
        take: 2
      })
    ]);

    // 3. Build a safe activity feed (Removed transactions)
    const activities = recentCommunities.flatMap(cm => cm.community.discussions.map(p => ({
      text: `New post in ${cm.community.name}`,
      date: p.id, // Using ID as placeholder for date if createdAt is missing
      type: 'post'
    }))).slice(0, 5);

    return NextResponse.json({
      enrolledCourses: enrolledCoursesCount,
      communities: joinedCommunitiesCount,
      stats: {
        streak: user.streak || 0,
        rank: `#${rank}`
      },
      enrolledCoursesList: enrolledCourses.map(e => ({
        id: e.course.id,
        title: e.course.title,
        progress: e.progress,
        nextLesson: "Continue where you left off"
      })),
      activities: activities || []
    });

  } catch (error: any) {
    console.error('Dashboard stats API Error:', error);
    // Return safe defaults on error to keep UI alive
    return NextResponse.json({
      enrolledCourses: 0,
      communities: 0,
      stats: { streak: 0, rank: 'N/A' },
      enrolledCoursesList: [],
      activities: []
    });
  }
}
