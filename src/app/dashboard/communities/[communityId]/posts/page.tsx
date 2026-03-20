'use client';

import { useState, useEffect, use } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Loader2, Trash2, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

export default function ReviewPostsPage({ params }: { params: Promise<{ communityId: string }> }) {
  const { communityId } = use(params);
  const { toast } = useToast();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchPosts = async () => {
    try {
      const res = await fetch(`/api/communities/${communityId}/posts`);
      if (res.ok) setPosts(await res.json());
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to load posts' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPosts(); }, [communityId]);

  const handleDelete = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    setDeletingId(postId);
    try {
      const res = await fetch(`/api/discussions/${postId}`, { method: 'DELETE' });
      if (res.ok) {
        toast({ title: 'Success', description: 'Post deleted' });
        setPosts(posts.filter(p => p.id !== postId));
      } else {
        throw new Error('Failed to delete');
      }
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Deletion failed' });
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-8">
      <Link href={`/dashboard/communities/${communityId}`} className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Content Moderation</CardTitle>
          <CardDescription>Audit and manage community discussions</CardDescription>
        </CardHeader>
        <CardContent className="divide-y divide-border">
          {posts.length === 0 ? (
            <div className="py-20 text-center text-muted-foreground">No posts found in this community.</div>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="py-6 flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={`https://picsum.photos/seed/${post.authorId}/100/100`} />
                      <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-bold">{post.author.name}</span>
                    <span className="text-xs text-muted-foreground">
                      • {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm line-clamp-3">{post.content}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><MessageSquare className="h-3 w-3" /> {post._count.comments} comments</span>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => handleDelete(post.id)}
                  disabled={deletingId === post.id}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
