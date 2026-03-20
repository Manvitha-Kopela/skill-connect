import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import * as jose from 'jose';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ communityId: string }> }
) {
  const { communityId } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key');
    const { payload } = await jose.jwtVerify(token, secret);
    const userId = payload.userId as string;

    const callerMembership = await prisma.communityMember.findUnique({
      where: { userId_communityId: { userId, communityId } }
    });

    if (callerMembership?.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const { memberId } = await req.json();

    await prisma.communityMember.update({
      where: { userId_communityId: { userId: memberId, communityId } },
      data: { role: 'ADMIN' }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
