import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    const { lessonId } = await params;
    await prisma.lesson.delete({
      where: { id: lessonId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete lesson error:", error);
    return NextResponse.json(
      { error: "Failed to delete lesson" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    const { lessonId } = await params;
    const body = await req.json();
    const { title, description } = body;

    const updatedLesson = await prisma.lesson.update({
      where: { id: lessonId },
      data: {
        title,
        description,
      },
    });

    return NextResponse.json(updatedLesson);
  } catch (error: any) {
    console.error("Update lesson error:", error);
    return NextResponse.json(
      { error: "Failed to update lesson" },
      { status: 500 }
    );
  }
}
