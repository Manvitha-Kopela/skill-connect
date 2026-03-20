import prisma from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import jwt from 'jsonwebtoken';

export async function POST(req: NextRequest) {
  const token = req.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { userId: string };
    const body = await req.json();
    const { title, content, communityId } = body;

    if (!content || !communityId) {
      return NextResponse.json({ message: 'Content and Community ID are required' }, { status: 400 });
    }

    const discussionContent = title ? `### ${title}\n\n${content}` : content;

    const discussion = await prisma.discussion.create({
      data: {
        content: discussionContent,
        communityId: communityId,
        authorId: decoded.userId
      },
      include: {
        author: {
          select: { id: true, name: true }
        },
        _count: {
          select: { comments: true, likes: true }
        }
      }
    })

    return NextResponse.json(discussion, { status: 201 });
  } catch (error: any) {
    console.error('Discussion creation error:', error);
    return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}
