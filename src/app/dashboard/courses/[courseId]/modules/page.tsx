'use client';

import { useState, useEffect, use } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, PlusCircle, Layers, Edit, Trash2, Loader2 } from 'lucide-react';
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
  
  // Form States
  const [moduleTitle, setModuleTitle] = useState("");
  const [moduleDescription, setModuleDescription] = useState("");
  const [selectedModule, setSelectedModule] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function fetchModules() {
      try {
        const res = await fetch(`/api/courses/${courseId}/modules`);
        if (res.ok) {
          const data = await res.json();
          setModules(data);
        }
      } catch (error) {
        console.error('Failed to fetch modules', error);
      } finally {
        setLoading(false);
      }
    }
    fetchModules();
  }, [courseId]);

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
      router.refresh();
      window.location.reload();
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
      setModuleTitle("");
      setModuleDescription("");
      router.refresh();
      window.location.reload();
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
      router.refresh();
      window.location.reload();
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Could not delete module" });
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
        }} className="gap-2 cursor-pointer">
          <PlusCircle className="h-4 w-4" />
          Add New Module
        </Button>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold">Module Management</h1>
          <p className="text-muted-foreground">Structure your course curriculum by adding and organizing modules.</p>
        </div>

        <div className="grid gap-4">
          {modules.length === 0 ? (
            <Card className="border-dashed bg-muted/10">
              <CardContent className="p-12 text-center">
                <Layers className="mx-auto h-12 w-12 text-muted-foreground/30 mb-4" />
                <h3 className="text-lg font-bold">No modules yet</h3>
                <p className="text-muted-foreground mb-6">Create your first module to start building the curriculum.</p>
                <Button onClick={() => setCreateOpen(true)} className="cursor-pointer">
                  Create First Module
                </Button>
              </CardContent>
            </Card>
          ) : (
            modules.map((module, index) => (
              <Card key={module.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center justify-center w-10 h-10 rounded bg-primary/10 text-primary font-bold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="font-bold text-lg">{module.title}</span>
                      {module.description && (
                        <p className="text-sm text-muted-foreground line-clamp-1 max-w-xl">
                          {module.description}
                        </p>
                      )}
                      <span className="text-xs text-primary/80 font-medium">
                        {module._count?.lessons || 0} Lessons • Order: {module.order}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
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
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Create Module Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Module</DialogTitle>
            <DialogDescription>
              Add a new section to your course curriculum.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Module Title</Label>
              <Input 
                id="title" 
                placeholder="e.g. Introduction to React" 
                value={moduleTitle}
                onChange={(e) => setModuleTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Module Description</Label>
              <Textarea 
                id="description" 
                placeholder="What will students learn in this module?" 
                value={moduleDescription}
                onChange={(e) => setModuleDescription(e.target.value)}
                className="min-h-[100px] resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)} className="cursor-pointer">Cancel</Button>
            <Button onClick={handleCreateModule} disabled={isSubmitting || !moduleTitle.trim()} className="cursor-pointer">
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Module
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Module Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Module</DialogTitle>
            <DialogDescription>
              Update the details of your module.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Module Title</Label>
              <Input 
                id="edit-title" 
                value={moduleTitle}
                onChange={(e) => setModuleTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Module Description</Label>
              <Textarea 
                id="edit-description" 
                value={moduleDescription}
                onChange={(e) => setModuleDescription(e.target.value)}
                className="min-h-[100px] resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)} className="cursor-pointer">Cancel</Button>
            <Button onClick={handleEditModule} disabled={isSubmitting || !moduleTitle.trim()} className="cursor-pointer">
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the module
              <strong> {selectedModule?.title}</strong> and all its associated lessons.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting} className="cursor-pointer">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault();
                handleDeleteModule();
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer"
              disabled={isSubmitting}
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete Module
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
