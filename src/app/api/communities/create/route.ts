import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken';

export async function POST(req: NextRequest) {
  const token = req.cookies.get('token')?.value;

  try {
    const body = await req.json();
    const { name, description, category } = body;

    if (!name) {
      return NextResponse.json({ message: "Community name is required" }, { status: 400 });
    }

    // Default thumbnail
    const thumbnailUrl = `https://picsum.photos/seed/${Date.now()}/800/600`;

    const community = await prisma.community.create({
      data: {
        name,
        description: description || "",
        category: category || "Other",
        thumbnailUrl,
        memberCount: 1, // Creator is the first member
      },
    });

    // If user is logged in, automatically make them a member
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { userId: string };
        await prisma.communityMember.create({
          data: {
            userId: decoded.userId,
            communityId: community.id,
            role: 'ADMIN',
          }
        });
      } catch (authError) {
        console.error("Failed to automatically join creator to community:", authError);
      }
    }

    return NextResponse.json(community, { status: 201 });
  } catch (error: any) {
    console.error("Community creation error:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
