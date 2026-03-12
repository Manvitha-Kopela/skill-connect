'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MessageSquare, PlusCircle, Search, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import PostCard from '@/components/post-card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

export default function CommunityDiscussionPage({ params }: { params: Promise<{ communityId: string }> }) {
  const resolvedParams = use(params);
  const communityId = resolvedParams.communityId;
  const router = useRouter();
  const { toast } = useToast();

  const [community, setCommunity] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCommunityData = async () => {
    try {
      const res = await fetch('/api/communities');
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        const found = data.find((c: any) => c.id === communityId);
        if (found) {
          setCommunity(found);
        }
      }
    } catch (error) {
      console.error("Failed to fetch community", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunityData();
  }, [communityId]);

  const handleCreateDiscussion = async () => {
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/discussions/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          communityId
        })
      });

      if (res.ok) {
        toast({ title: "Success", description: "Your discussion has been posted!" });
        setOpen(false);
        setTitle("");
        setContent("");
        fetchCommunityData();
        router.refresh();
      } else {
        const err = await res.json();
        throw new Error(err.message || "Failed to post discussion");
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message
      });
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

  if (!community) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-2xl font-bold">Community not found</h1>
        <Button asChild variant="link" className="mt-4">
          <Link href="/communities">Back to Communities</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <Link 
          href={`/communities/${community.id}`} 
          className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Community Feed
        </Link>
        <Button className="gap-2" onClick={() => setOpen(true)}>
          <PlusCircle className="h-4 w-4" /> New Discussion
        </Button>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold flex items-center gap-3">
             <MessageSquare className="h-8 w-8 text-primary" />
             {community.name} Discussions
          </h1>
          <p className="text-muted-foreground">Ask questions, share insights, and engage with other community members.</p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search discussions..." className="pl-10 h-12" />
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Badge>All</Badge>
          <Badge variant="outline">Unanswered</Badge>
          <Badge variant="outline">Announcements</Badge>
          <Badge variant="outline">Q&A</Badge>
        </div>

        <div className="grid gap-6">
          {!community.discussions || community.discussions.length === 0 ? (
            <div className="py-20 text-center border-2 border-dashed rounded-xl bg-muted/20">
              <p className="text-muted-foreground">No discussions started yet. Be the first to post!</p>
            </div>
          ) : (
            community.discussions.map((discussion: any) => (
              <PostCard key={discussion.id} post={discussion} />
            ))
          )}
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create Discussion</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Input
                placeholder="Discussion title (optional)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Textarea
                placeholder="Write your discussion..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[150px] resize-none"
                disabled={isSubmitting}
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleCreateDiscussion} disabled={isSubmitting || !content.trim()}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Posting...
                </>
              ) : (
                'Post Discussion'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}