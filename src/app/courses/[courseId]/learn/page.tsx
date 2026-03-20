'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { 
  PlayCircle, 
  CheckCircle2, 
  ArrowLeft, 
  Loader2, 
  Video,
  FileText,
  Clock,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

export default function LearningPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = use(params);
  const router = useRouter();
  const { toast } = useToast();

  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentLesson, setCurrentLesson] = useState<any>(null);
  const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [completing, setCompleting] = useState(false);
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);

  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      try {
        const [courseRes, statusRes] = await Promise.all([
          fetch('/api/courses'),
          fetch(`/api/courses/${courseId}/enrollment-status`)
        ]);

        if (!mounted) return;

        const courseData = await courseRes.json();
        const statusData = await statusRes.json();

        if (courseRes.ok && courseData.success) {
          const found = courseData.courses.find((c: any) => c.id === courseId);
          if (found) {
            // Course state update with equality check
            setCourse((prev: any) => {
              if (JSON.stringify(prev) === JSON.stringify(found)) {
                return prev;
              }
              return found;
            });

            const currentProgress = statusData.progress || 0;
            
            // Progress state update with equality check
            setProgress(prev => {
              if (prev === currentProgress) {
                return prev;
              }
              return currentProgress;
            });
            
            const allLessons: any[] = [];
            found.modules.forEach((m: any) => {
              if (m.lessons) allLessons.push(...m.lessons);
            });
            
            const total = allLessons.length;
            const completedCount = total > 0 ? Math.round((currentProgress / 100) * total) : 0;
            const completedIds = allLessons.slice(0, completedCount).map((l: any) => l.id);
            
            // Completed lessons state update with equality check
            setCompletedLessonIds(prev => {
              if (JSON.stringify(prev) === JSON.stringify(completedIds)) {
                return prev;
              }
              return completedIds;
            });
            
            if (found.modules?.length > 0) {
              const firstLesson = found.modules[0].lessons?.[0];
              if (firstLesson) {
                // Initial lesson update using the requested pattern
                setCurrentLesson((prev: any) => prev ?? firstLesson);
              }
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch page data", error);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchData();

    return () => {
      mounted = false;
    };
  }, [courseId]);

  const handleCompleteLesson = async () => {
    if (!currentLesson || completing || completedLessonIds.includes(currentLesson.id)) return;

    setCompleting(true);
    try {
      const res = await fetch('/api/lessons/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonId: currentLesson.id,
          courseId: courseId
        })
      });

      if (res.ok) {
        const data = await res.json();
        const newProgress = data.progress;
        
        setProgress(prev => prev === newProgress ? prev : newProgress);
        setCompletedLessonIds(prev => {
          if (prev.includes(currentLesson.id)) return prev;
          return [...prev, currentLesson.id];
        });
        setIsCompleteDialogOpen(true);
      } else {
        throw new Error("Failed to update progress");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not save your progress. Please try again."
      });
    } finally {
      setCompleting(false);
    }
  };

  const goToNextLesson = () => {
    setIsCompleteDialogOpen(false);
    
    let foundCurrent = false;
    let nextLesson = null;

    for (const module of course.modules) {
      for (const lesson of module.lessons) {
        if (foundCurrent) {
          nextLesson = lesson;
          break;
        }
        if (lesson.id === currentLesson.id) {
          foundCurrent = true;
        }
      }
      if (nextLesson) break;
    }

    if (nextLesson) {
      setCurrentLesson(nextLesson);
    } else {
      toast({
        title: "Course Completed!",
        description: "You've reached the end of the available content. Great job!"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse font-medium">Entering classroom...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-20 bg-muted/20 rounded-2xl border-2 border-dashed">
        <h2 className="text-2xl font-bold">Course not found</h2>
        <Button asChild variant="link" className="mt-4">
          <Link href="/dashboard/enrolled-courses">Back to Learning Path</Link>
        </Button>
      </div>
    );
  }

  const isCurrentLessonCompleted = currentLesson && completedLessonIds.includes(currentLesson.id);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Button variant="ghost" asChild className="gap-2 font-bold w-fit cursor-pointer">
          <Link href="/dashboard/enrolled-courses">
            <ArrowLeft className="h-4 w-4" /> Exit Classroom
          </Link>
        </Button>
        <div className="flex items-center gap-4 bg-card border rounded-full px-4 py-2 shadow-sm">
            <div className="flex flex-col min-w-[100px]">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-tighter mb-1">
                <span className="text-muted-foreground">Course Progress</span>
                <span className="text-primary">{progress}%</span>
              </div>
              <Progress value={progress} className="h-1.5" />
            </div>
            <div className="h-8 w-px bg-border hidden sm:block" />
            <span className="text-sm font-black text-primary truncate max-w-[200px] hidden sm:inline">{course.title}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-6">
          <Card className="overflow-hidden border-2 border-primary/10 shadow-2xl rounded-2xl">
            <div className="aspect-video bg-black relative flex items-center justify-center">
              {currentLesson?.videoUrl ? (
                <video 
                  key={currentLesson.id}
                  controls 
                  className="w-full h-full"
                  poster={course.thumbnailUrl}
                  controlsList="nodownload"
                >
                  <source src={currentLesson.videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <div className="text-center p-12 space-y-4">
                  <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                    <Video className="h-10 w-10 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-white text-lg font-bold">No video for this lesson</p>
                    <p className="text-gray-400 text-sm">Review the notes below or select another lesson.</p>
                  </div>
                </div>
              )}
            </div>
            <CardContent className="p-6 sm:p-10 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b">
                <div className="space-y-2">
                  <h1 className="text-2xl sm:text-4xl font-black tracking-tighter">
                    {currentLesson?.title || "Select a lesson"}
                  </h1>
                  <div className="flex items-center gap-4 text-sm font-bold text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4" /> {currentLesson?.duration || "5:00"}
                    </div>
                    {currentLesson?.videoUrl && (
                      <div className="flex items-center gap-1.5 text-primary">
                        <Video className="h-4 w-4" /> HD Streaming
                      </div>
                    )}
                  </div>
                </div>
                <Button 
                  size="lg" 
                  className={cn(
                    "font-bold gap-2 shadow-xl h-12 px-8 cursor-pointer transition-all",
                    isCurrentLessonCompleted && "bg-green-600 hover:bg-green-700 text-white"
                  )}
                  onClick={handleCompleteLesson}
                  disabled={completing || isCurrentLessonCompleted}
                >
                  {completing ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : isCurrentLessonCompleted ? (
                    <>Completed <CheckCircle2 className="h-5 w-5" /></>
                  ) : (
                    <>Complete Lesson <CheckCircle2 className="h-5 w-5" /></>
                  )}
                </Button>
              </div>
              
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                <h3 className="text-xl font-black mb-4">Lesson Overview</h3>
                <p className="text-muted-foreground leading-relaxed text-lg whitespace-pre-wrap">
                  {currentLesson?.description || "Follow the tutorial video and practice the concepts demonstrated."}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-4 lg:sticky lg:top-24">
          <Card className="lg:max-h-[calc(100vh-12rem)] flex flex-col rounded-2xl shadow-xl border-primary/5">
            <CardHeader className="border-b bg-muted/20">
              <CardTitle className="text-lg font-black flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Curriculum
              </CardTitle>
            </CardHeader>
            <ScrollArea className="flex-1">
              <div className="p-4 space-y-8 py-6">
                {!course.modules || course.modules.length === 0 ? (
                  <p className="text-center text-sm text-muted-foreground py-10 italic">No content available.</p>
                ) : (
                  course.modules.map((module: any, mIdx: number) => (
                    <div key={module.id} className="space-y-4">
                      <h4 className="font-black text-[11px] uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                        <span className="h-6 w-6 rounded-md bg-primary/10 flex items-center justify-center text-primary">
                          {mIdx + 1}
                        </span>
                        {module.title}
                      </h4>
                      <div className="space-y-2 ml-3 border-l-2 border-muted pl-4">
                        {module.lessons?.map((lesson: any) => {
                          const completed = completedLessonIds.includes(lesson.id);
                          return (
                            <button
                              key={lesson.id}
                              onClick={() => setCurrentLesson(lesson)}
                              className={cn(
                                "w-full text-left px-4 py-3 rounded-xl text-sm transition-all group relative cursor-pointer",
                                currentLesson?.id === lesson.id 
                                  ? "bg-primary text-primary-foreground font-bold shadow-lg scale-[1.02]" 
                                  : "hover:bg-muted text-foreground/80"
                              )}
                            >
                              <div className="flex items-center gap-3">
                                {currentLesson?.id === lesson.id ? (
                                  <PlayCircle className="h-4 w-4 shrink-0 animate-pulse" />
                                ) : completed ? (
                                  <CheckCircle2 className="h-4 w-4 shrink-0 text-green-500" />
                                ) : (
                                  <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/30 group-hover:border-primary shrink-0 transition-colors" />
                                )}
                                <span className={cn("line-clamp-2", completed && currentLesson?.id !== lesson.id && "text-muted-foreground")}>
                                  {lesson.title}
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </Card>
        </div>
      </div>

      <Dialog open={isCompleteDialogOpen} onOpenChange={setIsCompleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Lesson Completed 🎉</DialogTitle>
            <DialogDescription>
              Great job! You've successfully finished this lesson. Keep up the momentum!
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button className="w-full font-bold cursor-pointer" onClick={goToNextLesson}>
              Continue to Next Lesson <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
