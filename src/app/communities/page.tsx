'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { communities } from '@/lib/mock-data';
import CommunityCard from '@/components/community-card';
import { motion, AnimatePresence } from 'framer-motion';

export default function CommunitiesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredCommunities = communities.filter(community => {
    return (
      community.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (categoryFilter === 'all' || community.category === categoryFilter)
    );
  });
  
  const categories = ['all', 'Course', 'College', 'Professional'];

  return (
    <div>
      <div className="mb-8 space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Find Your Tribe</h1>
        <p className="text-muted-foreground">
          Connect with peers, mentors, and friends in our vibrant communities.
        </p>
      </div>
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
        <Input
          placeholder="Search communities..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by category" />
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

      <motion.div
        layout
        className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
      >
        <AnimatePresence>
          {filteredCommunities.map((community) => (
             <motion.div
             key={community.id}
             layout
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             transition={{ duration: 0.3 }}
           >
              <CommunityCard community={community} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
