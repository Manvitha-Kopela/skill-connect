
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
import CommunityCard from '@/components/community-card';
import { motion, AnimatePresence } from 'framer-motion';
import { Community } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Search } from 'lucide-react';

export default function CommunitiesPage() {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    async function fetchCommunities() {
      try {
        const res = await fetch('/api/communities');
        if (res.ok) {
          const data = await res.json();
          setCommunities(Array.isArray(data) ? data : []);
        } else {
          const errorData = await res.json().catch(() => null);
          console.error("Failed to fetch communities:", res.status, errorData?.message || res.statusText);
          setCommunities([]);
        }
      } catch (error) {
        console.error("Failed to fetch communities", error);
        setCommunities([]);
      } finally {
        setLoading(false);
      }
    }
    fetchCommunities();
  }, []);

  const filteredCommunities = communities.filter(community => {
    return (
      community.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (categoryFilter === 'all' || community.category === categoryFilter)
    );
  });
  
  const categories = ['all', ...Array.from(new Set(communities.map(c => c.category)))];

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Find Your Tribe</h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Connect with peers, mentors, and friends in our vibrant, community-driven ecosystem.
        </p>
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
              <div className="col-span-full py-20 text-center">
                <p className="text-xl text-muted-foreground">No communities found.</p>
              </div>
            )}
            </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
