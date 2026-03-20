import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import * as jose from 'jose';

async function checkAdmin(req: NextRequest, communityId: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  if (!token) return null;

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key');
    const { payload } = await jose.jwtVerify(token, secret);
    const userId = payload.userId as string;

    const membership = await prisma.communityMember.findUnique({
      where: {
        userId_communityId: { userId, communityId }
      }
    });

    if (membership?.role !== 'ADMIN') return null;
    return userId;
  } catch (error) {
    return null;
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ communityId: string }> }
) {
  const { communityId } = await params;
  const adminId = await checkAdmin(req, communityId);

  if (!adminId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { name, description, category } = body;

    const community = await prisma.community.update({
      where: { id: communityId },
      data: {
        name: name?.trim(),
        description: description?.trim(),
        category: category
      }
    });

    return NextResponse.json(community);
  } catch (error: any) {
    console.error('Community update error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
