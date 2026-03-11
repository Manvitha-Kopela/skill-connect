'use client';

import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

interface AddLessonButtonProps {
  moduleId: string;
}

export default function AddLessonButton({ moduleId }: AddLessonButtonProps) {
  async function addLesson() {
    try {
      const res = await fetch("/api/lessons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          moduleId,
          title: "New Lesson"
        })
      });

      if (!res.ok) {
        alert("Failed to create lesson");
        return;
      }

      window.location.reload();
    } catch (error) {
      console.error("Add lesson error:", error);
      alert("An unexpected error occurred");
    }
  }

  return (
    <Button size="sm" variant="outline" className="h-8 gap-2" onClick={addLesson}>
      <PlusCircle className="h-3 w-3" /> Add Lesson
    </Button>
  );
}
