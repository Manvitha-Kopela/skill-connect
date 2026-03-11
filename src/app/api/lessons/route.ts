import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { moduleId, title } = body;

    if (!moduleId) {
      return NextResponse.json(
        { error: "Module ID required" },
        { status: 400 }
      );
    }

    const count = await prisma.lesson.count({
      where: { moduleId }
    });

    const lesson = await prisma.lesson.create({
      data: {
        title: title || "New Lesson",
        moduleId,
        order: count + 1,
        duration: "5:00"
      }
    });

    return NextResponse.json(lesson);
  } catch (error: any) {
    console.error("Lesson creation error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
