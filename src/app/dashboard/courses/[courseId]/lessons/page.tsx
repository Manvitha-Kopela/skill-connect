import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import * as jose from "jose";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Play, Clock, Video, PlusCircle } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import AddLessonButton from "@/components/add-lesson-button";

export default async function LessonsPage({
  params,
}: {
  params: { courseId: string };
}) {
  const courseId = params.courseId;

  // Auth check
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) redirect("/login");

  let userId: string;
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key");
    const { payload } = await jose.jwtVerify(token, secret);
    userId = payload.userId as string;
  } catch (error) {
    redirect("/login");
  }

  // Fetch course safely with Prisma
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      modules: {
        include: {
          lessons: {
            orderBy: {
              order: "asc",
            },
          },
        },
        orderBy: {
          order: "asc",
        },
      },
    },
  });

  if (!course) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-xl font-bold">Course not found</h1>
        <Button asChild variant="link" className="mt-4">
          <Link href="/dashboard/courses">Back to My Courses</Link>
        </Button>
      </div>
    );
  }

  // Ownership check
  if (course.instructorId !== userId) {
    redirect("/dashboard/courses");
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <Link 
          href={`/dashboard/courses/${course.id}`} 
          className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Editor
        </Link>
      </div>

      <div className="space-y-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold">Lesson Content</h1>
          <p className="text-muted-foreground">Manage the educational content and video tutorials for each module.</p>
        </div>

        {course.modules.length === 0 ? (
          <Card className="border-dashed bg-muted/10">
            <CardContent className="p-12 text-center">
              <Play className="mx-auto h-12 w-12 text-muted-foreground/30 mb-4" />
              <h3 className="text-lg font-bold">No curriculum structure</h3>
              <p className="text-muted-foreground mb-6">You need to create at least one module before adding lessons.</p>
              <Button asChild variant="outline">
                <Link href={`/dashboard/courses/${course.id}/modules`}>Go to Modules</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          course.modules.map((module) => (
            <div key={module.id} className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <div className="flex flex-col gap-1">
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    <Badge variant="secondary" className="rounded-sm">Module</Badge>
                    {module.title}
                  </h3>
                  {module.description && (
                    <p className="text-sm text-muted-foreground">{module.description}</p>
                  )}
                </div>
                <AddLessonButton moduleId={module.id} />
              </div>
              <div className="grid gap-3">
                {module.lessons && module.lessons.length > 0 ? (
                  module.lessons.map((lesson) => (
                    <Card key={lesson.id} className="group hover:border-primary/50 transition-colors">
                      <CardContent className="p-5 flex items-center justify-between">
                        <div className="flex items-center gap-5">
                          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                            <Play className="h-5 w-5 fill-current" />
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <span className="font-bold text-base">{lesson.title}</span>
                            {lesson.description && (
                              <p className="text-xs text-muted-foreground line-clamp-1 max-w-lg mb-1">{lesson.description}</p>
                            )}
                            <div className="flex items-center gap-3 text-xs font-medium text-muted-foreground/80">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" /> {lesson.duration || "5:00"}
                              </span>
                              {lesson.videoUrl && (
                                <span className="flex items-center gap-1 text-primary">
                                  <Video className="h-3 w-3" /> Video Attached
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="p-8 text-center border-2 border-dashed rounded-lg bg-muted/5">
                    <p className="text-sm text-muted-foreground font-medium">No lessons in this module yet.</p>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
