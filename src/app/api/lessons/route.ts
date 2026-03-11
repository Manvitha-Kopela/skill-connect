import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const moduleId = formData.get("moduleId") as string;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const videoFile = formData.get("video") as File | null;

    if (!moduleId) {
      return NextResponse.json(
        { error: "Module ID required" },
        { status: 400 }
      );
    }

    if (!title) {
      return NextResponse.json(
        { error: "Lesson title required" },
        { status: 400 }
      );
    }

    const count = await prisma.lesson.count({
      where: { moduleId }
    });

    let videoUrl = "";
    let duration = "0:00";

    if (videoFile) {
      // Prototype simulation of video storage
      // In a real production app, you'd use a cloud provider like Firebase Storage, S3, or Cloudinary
      videoUrl = `/uploads/${Date.now()}-${videoFile.name.replace(/\s+/g, '_')}`;
      
      // Simulating duration calculation
      // Probing file metadata usually requires native binaries on the server
      duration = "5:45"; 
    }

    const lesson = await prisma.lesson.create({
      data: {
        title: title,
        description: description || "",
        moduleId,
        order: count + 1,
        duration: duration,
        videoUrl: videoUrl || null,
      }
    });

    return NextResponse.json(lesson);
  } catch (error: any) {
    console.error("Lesson creation error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
