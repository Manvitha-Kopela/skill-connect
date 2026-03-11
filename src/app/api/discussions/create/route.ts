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

    // Since the system uses the 'Post' model, we'll format the title into the content 
    // to maintain the "Discussion" feel without changing the DB schema.
    const postContent = title ? `### ${title}\n\n${content}` : content;

    const post = await prisma.post.create({
      data: {
        content: postContent,
        communityId: communityId,
        authorId: decoded.userId
      }
    })

    return NextResponse.json(post, { status: 201 });
  } catch (error: any) {
    console.error('Discussion creation error:', error);
    return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}
