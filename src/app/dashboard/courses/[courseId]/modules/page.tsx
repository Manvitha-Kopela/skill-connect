'use client';

import { useState, useEffect, use } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, PlusCircle, Layers, Edit, Trash2, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export default function ModuleManagementPage({ params }: { params: Promise<{ courseId: string }> }) {
  const resolvedParams = use(params);
  const courseId = resolvedParams.courseId;
  const router = useRouter();
  const { toast } = useToast();
  
  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creatingFirstModule, setCreatingFirstModule] = useState(false);
  const [addingModule, setAddingModule] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

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

  async function handleCreateModule(isFirst: boolean = false) {
    const title = window.prompt("Enter module title:");
    if (!title || title.trim() === "") return;

    if (isFirst) setCreatingFirstModule(true);
    else setAddingModule(true);

    try {
      const res = await fetch("/api/modules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: courseId,
          title: title.trim()
        })
      });

      if (!res.ok) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to create module"
        });
        return;
      }

      toast({
        title: "Success",
        description: "Module created successfully"
      });
      
      window.location.reload();
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred"
      });
    } finally {
      if (isFirst) setCreatingFirstModule(false);
      else setAddingModule(false);
    }
  }

  async function handleEditModule(moduleId: string, currentTitle: string) {
    const newTitle = window.prompt("Edit module title:", currentTitle);
    if (!newTitle || newTitle.trim() === "" || newTitle === currentTitle) return;

    setProcessingId(moduleId);
    try {
      const res = await fetch("/api/modules", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          moduleId,
          title: newTitle.trim()
        })
      });

      if (!res.ok) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to update module"
        });
        return;
      }

      toast({
        title: "Success",
        description: "Module updated successfully"
      });
      
      window.location.reload();
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred"
      });
    } finally {
      setProcessingId(null);
    }
  }

  async function handleDeleteModule(moduleId: string) {
    if (!window.confirm("Are you sure you want to delete this module? This action cannot be undone.")) return;

    setProcessingId(moduleId);
    try {
      const res = await fetch("/api/modules", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ moduleId })
      });

      if (!res.ok) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to delete module"
        });
        return;
      }

      toast({
        title: "Success",
        description: "Module deleted successfully"
      });
      
      window.location.reload();
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred"
      });
    } finally {
      setProcessingId(null);
    }
  }

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
          className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Editor
        </Link>
        <Button onClick={() => handleCreateModule(false)} disabled={addingModule} className="gap-2">
          {addingModule ? <Loader2 className="h-4 w-4 animate-spin" /> : <PlusCircle className="h-4 w-4" />}
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
                <Button onClick={() => handleCreateModule(true)} disabled={creatingFirstModule}>
                  {creatingFirstModule && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create First Module
                </Button>
              </CardContent>
            </Card>
          ) : (
            modules.map((module, index) => (
              <Card key={module.id} className={processingId === module.id ? "opacity-50 pointer-events-none" : ""}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded bg-primary/10 text-primary font-bold text-xs">
                      {index + 1}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold">{module.title}</span>
                      <span className="text-xs text-muted-foreground">
                        {module._count?.lessons || 0} Lessons • Order: {module.order}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {processingId === module.id ? (
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    ) : (
                      <>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={() => handleEditModule(module.id, module.title)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 text-destructive"
                          onClick={() => handleDeleteModule(module.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
