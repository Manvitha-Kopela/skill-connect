import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const moduleId = formData.get("moduleId") as string;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const videoFile = formData.get("video") as File;

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

    let videoUrl = "";
    let duration = "0:00";

    if (videoFile && videoFile.size > 0) {
      const bytes = await videoFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Ensure upload directory exists
      const uploadDir = join(process.cwd(), "public", "uploads");
      try {
        await mkdir(uploadDir, { recursive: true });
      } catch (e) {}

      const filename = `${Date.now()}-${videoFile.name.replace(/\s+/g, "-")}`;
      const path = join(uploadDir, filename);
      await writeFile(path, buffer);
      
      videoUrl = `/uploads/${filename}`;
      // In a real app, you'd use a tool like ffmpeg to get duration.
      // Here we mock it or default it.
      duration = "10:00"; 
    }

    const count = await prisma.lesson.count({
      where: { moduleId }
    });

    const lesson = await prisma.lesson.create({
      data: {
        title: title || "New Lesson",
        description: description || "",
        videoUrl: videoUrl,
        moduleId,
        order: count + 1,
        duration: duration
      }
    });

    return NextResponse.json(lesson);
  } catch (error: any) {
    console.error("Lesson creation error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
