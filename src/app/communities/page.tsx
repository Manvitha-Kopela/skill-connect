'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import CommunityCard from '@/components/community-card';
import { motion, AnimatePresence } from 'framer-motion';
import { Community } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Plus, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export default function CommunitiesPage() {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  // New community form state
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newCategory, setNewCategory] = useState('Technology');

  const fetchCommunities = async () => {
    try {
      const res = await fetch('/api/communities');
      const data = await res.json();

      if (res.ok && Array.isArray(data)) {
        setCommunities(data);
      } else {
        console.error("Failed to fetch communities:", data?.message || "Unknown error");
        setCommunities([]);
      }
    } catch (error) {
      console.error("Network error while fetching communities", error);
      setCommunities([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunities();
  }, []);

  const handleCreateCommunity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/communities/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newName,
          description: newDescription,
          category: newCategory,
        }),
      });

      if (res.ok) {
        toast({
          title: "Community Created",
          description: "Your new tribe is ready for members!",
        });
        setIsCreateOpen(false);
        setNewName('');
        setNewDescription('');
        fetchCommunities();
        router.refresh();
      } else {
        const error = await res.json();
        throw new Error(error.message || "Failed to create community");
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredCommunities = Array.isArray(communities) ? communities.filter(community => {
    return (
      community.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (categoryFilter === 'all' || community.category === categoryFilter)
    );
  }) : [];
  
  const categories = ['all', 'Technology', 'Design', 'Business', 'Lifestyle', 'Art', 'Science'];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Find Your Tribe</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Connect with peers, mentors, and friends in our vibrant ecosystem.
          </p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} className="gap-2 font-bold shadow-lg">
          <Plus className="h-4 w-4" /> Create Community
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search communities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(cat => (
              <SelectItem key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="aspect-[4/5] w-full" />)}
        </div>
      ) : (
        <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
            <AnimatePresence>
            {filteredCommunities.length > 0 ? filteredCommunities.map((community) => (
                <motion.div
                key={community.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
            >
                <CommunityCard community={community} />
                </motion.div>
            )) : (
              <div className="col-span-full py-20 text-center border rounded-xl bg-muted/20">
                <p className="text-xl text-muted-foreground">No communities found.</p>
              </div>
            )}
            </AnimatePresence>
        </motion.div>
      )}

      {/* Create Community Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Create New Community</DialogTitle>
            <DialogDescription>
              Start a new space for collaboration and learning.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateCommunity} className="space-y-6 py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="comm-name" className="font-bold">Community Name</Label>
                <Input
                  id="comm-name"
                  placeholder="e.g. React Developers Hub"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="comm-desc" className="font-bold">Description</Label>
                <Textarea
                  id="comm-desc"
                  placeholder="What is this community about?"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="min-h-[100px] resize-none"
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="comm-cat" className="font-bold">Category</Label>
                <Select value={newCategory} onValueChange={setNewCategory} disabled={isSubmitting}>
                  <SelectTrigger id="comm-cat">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.filter(c => c !== 'all').map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || !newName.trim()} className="min-w-[140px] font-bold">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...
                  </>
                ) : (
                  'Create Community'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
