
'use client';

import { useState, useEffect, use } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  PlusCircle, 
  Layers, 
  Edit, 
  Trash2, 
  Loader2, 
  Play, 
  Video, 
  FileText,
  Clock,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AddLessonButton from '@/components/add-lesson-button';
import { cn } from '@/lib/utils';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

export default function ModuleManagementPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = use(params);
  const { toast } = useToast();
  const router = useRouter();
  
  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Dialog States
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [lessonEditOpen, setLessonEditOpen] = useState(false);
  const [lessonDeleteOpen, setLessonDeleteOpen] = useState(false);
  const [videoPreviewOpen, setVideoPreviewOpen] = useState(false);
  
  // Form States
  const [moduleTitle, setModuleTitle] = useState("");
  const [moduleDescription, setModuleDescription] = useState("");
  const [selectedModule, setSelectedModule] = useState<any>(null);
  const [selectedLesson, setSelectedLesson] = useState<any>(null);
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonDescription, setLessonDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Expansion States
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});

  const fetchModules = async () => {
    try {
      const res = await fetch(`/api/courses/${courseId}/modules`);
      if (res.ok) {
        const data = await res.json();
        setModules(data);
        // Initially expand first module if exists
        if (data.length > 0 && Object.keys(expandedModules).length === 0) {
          setExpandedModules({ [data[0].id]: true });
        }
      }
    } catch (error) {
      console.error('Failed to fetch modules', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModules();
  }, [courseId]);

  const toggleModule = (id: string) => {
    setExpandedModules(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCreateModule = async () => {
    if (!moduleTitle.trim()) return;
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/modules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId,
          title: moduleTitle.trim(),
          description: moduleDescription.trim()
        })
      });

      if (!res.ok) throw new Error("Failed to create module");

      toast({ title: "Success", description: "Module created successfully" });
      setCreateOpen(false);
      setModuleTitle("");
      setModuleDescription("");
      fetchModules();
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Could not create module" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditModule = async () => {
    if (!moduleTitle.trim() || !selectedModule) return;
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/modules", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          moduleId: selectedModule.id,
          title: moduleTitle.trim(),
          description: moduleDescription.trim()
        })
      });

      if (!res.ok) throw new Error("Failed to update module");

      toast({ title: "Success", description: "Module updated successfully" });
      setEditOpen(false);
      setSelectedModule(null);
      fetchModules();
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Could not update module" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteModule = async () => {
    if (!selectedModule) return;
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/modules", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ moduleId: selectedModule.id })
      });

      if (!res.ok) throw new Error("Failed to delete module");

      toast({ title: "Success", description: "Module deleted successfully" });
      setDeleteOpen(false);
      setSelectedModule(null);
      fetchModules();
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Could not delete module" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditLesson = async () => {
    if (!lessonTitle.trim() || !selectedLesson) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/lessons/${selectedLesson.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: lessonTitle.trim(),
          description: lessonDescription.trim()
        })
      });

      if (!res.ok) throw new Error("Update failed");

      toast({ title: "Success", description: "Lesson updated successfully" });
      setLessonEditOpen(false);
      setSelectedLesson(null);
      fetchModules();
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Could not update lesson" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteLesson = async () => {
    if (!selectedLesson) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/lessons/${selectedLesson.id}`, {
        method: "DELETE"
      });

      if (!res.ok) throw new Error("Delete failed");

      toast({ title: "Success", description: "Lesson removed" });
      setLessonDeleteOpen(false);
      setSelectedLesson(null);
      fetchModules();
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Could not delete lesson" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <Link 
          href={`/dashboard/courses/${courseId}`} 
          className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors cursor-pointer"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Editor
        </Link>
        <Button onClick={() => {
          setModuleTitle("");
          setModuleDescription("");
          setCreateOpen(true);
        }} className="gap-2 cursor-pointer font-bold">
          <PlusCircle className="h-4 w-4" />
          Add New Module
        </Button>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-extrabold tracking-tight">Curriculum Management</h1>
          <p className="text-muted-foreground">Build your course by organizing modules and uploading educational lessons.</p>
        </div>

        <div className="grid gap-6 mt-8">
          {modules.length === 0 ? (
            <Card className="border-dashed bg-muted/10">
              <CardContent className="p-16 text-center">
                <Layers className="mx-auto h-16 w-16 text-muted-foreground/30 mb-4" />
                <h3 className="text-xl font-bold">No modules yet</h3>
                <p className="text-muted-foreground mb-8 max-w-sm mx-auto">Create your first section to start adding lessons and video content.</p>
                <Button onClick={() => setCreateOpen(true)} className="font-bold cursor-pointer h-12 px-8">
                  Create Your First Module
                </Button>
              </CardContent>
            </Card>
          ) : (
            modules.map((module, index) => {
              const isExpanded = expandedModules[module.id];
              return (
                <Card key={module.id} className={cn("overflow-hidden transition-all", isExpanded ? "border-primary/30 shadow-md" : "hover:border-primary/20")}>
                  <div className="p-6 flex items-center justify-between bg-muted/5">
                    <div className="flex items-center gap-6 flex-1 cursor-pointer" onClick={() => toggleModule(module.id)}>
                      <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary font-black text-sm">
                        {index + 1}
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="font-black text-xl flex items-center gap-2">
                          {module.title}
                          {isExpanded ? <ChevronUp className="h-4 w-4 opacity-50" /> : <ChevronDown className="h-4 w-4 opacity-50" />}
                        </span>
                        {module.description && (
                          <p className="text-sm text-muted-foreground line-clamp-1 max-w-xl">
                            {module.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <AddLessonButton moduleId={module.id} />
                      <div className="h-8 w-px bg-border mx-1" />
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-9 w-9 p-0 cursor-pointer"
                        onClick={() => {
                          setSelectedModule(module);
                          setModuleTitle(module.title);
                          setModuleDescription(module.description || "");
                          setEditOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-9 w-9 p-0 text-destructive cursor-pointer"
                        onClick={() => {
                          setSelectedModule(module);
                          setDeleteOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {isExpanded && (
                    <CardContent className="p-0 border-t bg-card">
                      <div className="divide-y divide-border/50">
                        {module.lessons && module.lessons.length > 0 ? (
                          module.lessons.map((lesson: any) => (
                            <div key={lesson.id} className="p-4 px-6 flex items-center justify-between group hover:bg-muted/20 transition-colors">
                              <div className="flex items-center gap-4 flex-1 cursor-pointer" onClick={() => {
                                setSelectedLesson(lesson);
                                setVideoPreviewOpen(true);
                              }}>
                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                  <Play className="h-3 w-3 fill-current" />
                                </div>
                                <div className="flex flex-col">
                                  <span className="font-bold text-sm">{lesson.title}</span>
                                  <div className="flex items-center gap-3 text-[10px] font-bold text-muted-foreground/70 uppercase tracking-tighter mt-0.5">
                                    <span className="flex items-center gap-1">
                                      <Clock className="h-3 w-3" /> {lesson.duration || "5:00"}
                                    </span>
                                    {lesson.videoUrl && (
                                      <span className="flex items-center gap-1 text-primary/80">
                                        <Video className="h-3 w-3" /> Video Linked
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 cursor-pointer"
                                  onClick={() => {
                                    setSelectedLesson(lesson);
                                    setLessonTitle(lesson.title);
                                    setLessonDescription(lesson.description || "");
                                    setLessonEditOpen(true);
                                  }}
                                >
                                  <Edit className="h-3.5 w-3.5" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 text-destructive cursor-pointer"
                                  onClick={() => {
                                    setSelectedLesson(lesson);
                                    setLessonDeleteOpen(true);
                                  }}
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="p-10 text-center text-muted-foreground bg-muted/5 italic text-sm">
                            No lessons added to this module yet. Click "Add Lesson" above to start.
                          </div>
                        )}
                      </div>
                    </CardContent>
                  )}
                </Card>
              );
            })
          )}
        </div>
      </div>

      {/* Module Create Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl font-black">Create New Module</DialogTitle>
            <DialogDescription>
              Add a new section to your course curriculum structure.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="font-bold">Module Title</Label>
              <Input 
                id="title" 
                placeholder="e.g. Fundamentals of UI Design" 
                value={moduleTitle}
                onChange={(e) => setModuleTitle(e.target.value)}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className="font-bold">Module Description</Label>
              <Textarea 
                id="description" 
                placeholder="Briefly explain what students will master in this section..." 
                value={moduleDescription}
                onChange={(e) => setModuleDescription(e.target.value)}
                className="min-h-[100px] resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)} className="font-bold">Cancel</Button>
            <Button onClick={handleCreateModule} disabled={isSubmitting || !moduleTitle.trim()} className="font-bold min-w-[120px]">
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Module"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Module Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl font-black">Edit Module</DialogTitle>
            <DialogDescription>Update the details of this curriculum section.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title" className="font-bold">Module Title</Label>
              <Input 
                id="edit-title" 
                value={moduleTitle}
                onChange={(e) => setModuleTitle(e.target.value)}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description" className="font-bold">Module Description</Label>
              <Textarea 
                id="edit-description" 
                value={moduleDescription}
                onChange={(e) => setModuleDescription(e.target.value)}
                className="min-h-[100px] resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)} className="font-bold">Cancel</Button>
            <Button onClick={handleEditModule} disabled={isSubmitting || !moduleTitle.trim()} className="font-bold min-w-[120px]">
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Lesson Edit Dialog */}
      <Dialog open={lessonEditOpen} onOpenChange={setLessonEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl font-black">Edit Lesson</DialogTitle>
            <DialogDescription>Update the lesson title and description.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="l-title" className="font-bold">Lesson Title</Label>
              <Input 
                id="l-title" 
                value={lessonTitle}
                onChange={(e) => setLessonTitle(e.target.value)}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="l-desc" className="font-bold">Lesson Description</Label>
              <Textarea 
                id="l-desc" 
                value={lessonDescription}
                onChange={(e) => setLessonDescription(e.target.value)}
                className="min-h-[100px] resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLessonEditOpen(false)} className="font-bold">Cancel</Button>
            <Button onClick={handleEditLesson} disabled={isSubmitting || !lessonTitle.trim()} className="font-bold min-w-[120px]">
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update Lesson"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Lesson Video Preview Dialog */}
      <Dialog open={videoPreviewOpen} onOpenChange={setVideoPreviewOpen}>
        <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden border-none bg-black">
          <VisuallyHidden>
            <DialogHeader>
              <DialogTitle>{selectedLesson?.title || "Video Preview"}</DialogTitle>
            </DialogHeader>
          </VisuallyHidden>
          <div className="aspect-video w-full relative">
            {selectedLesson?.videoUrl ? (
              <video 
                key={selectedLesson.id}
                controls 
                className="w-full h-full"
                controlsList="nodownload"
              >
                <source src={selectedLesson.videoUrl} type="video/mp4" />
              </video>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-white/50 space-y-4 p-12">
                <Video className="h-16 w-16 opacity-20" />
                <p className="font-bold">No video content for this lesson.</p>
              </div>
            )}
          </div>
          <div className="p-6 bg-card text-card-foreground">
            <h2 className="text-2xl font-black">{selectedLesson?.title}</h2>
            <p className="text-muted-foreground mt-2">{selectedLesson?.description || "No description provided."}</p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Module Delete Confirmation */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold">Delete curriculum section?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the module <strong>{selectedModule?.title}</strong> and all associated lessons. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting} className="font-bold">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault();
                handleDeleteModule();
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 font-bold"
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete Module"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Lesson Delete Confirmation */}
      <AlertDialog open={lessonDeleteOpen} onOpenChange={setLessonDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold">Remove lesson?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{selectedLesson?.title}</strong>? This will remove the video link and record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting} className="font-bold">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault();
                handleDeleteLesson();
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 font-bold"
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete Lesson"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
