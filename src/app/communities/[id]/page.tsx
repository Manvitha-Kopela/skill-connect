import { notFound } from 'next/navigation';
import { communities, posts, users } from '@/lib/mock-data';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import PostCard from '@/components/post-card';
import {
  BarChart,
  Book,
  BotMessageSquare,
  Info,
  Trophy,
  Users,
} from 'lucide-react';

export default function CommunityDetailPage({ params }: { params: { id: string } }) {
  const community = communities.find((c) => c.id === params.id);

  if (!community) {
    notFound();
  }

  const topContributors = users.slice(0, 3);

  return (
    <div className="mx-auto w-full">
      <div className="relative mb-8 h-48 w-full overflow-hidden rounded-lg bg-primary/10 md:h-64">
        <Image
          src={community.thumbnailUrl}
          alt={community.name}
          fill
          className="object-cover"
          data-ai-hint="community banner"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-0 left-0 p-4 md:p-8">
          <h1 className="text-3xl font-bold text-primary-foreground md:text-5xl">
            {community.name}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-primary-foreground/80 md:text-base">
            {community.description}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Sidebar */}
        <aside className="lg:col-span-3">
          <div className="sticky top-20 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Navigation</CardTitle>
              </CardHeader>
              <CardContent>
                <nav className="flex flex-col space-y-1">
                  <Button variant="ghost" className="justify-start">
                    <Info className="mr-2 h-4 w-4" /> About
                  </Button>
                  <Button variant="ghost" className="justify-start">
                    <Users className="mr-2 h-4 w-4" /> Members
                  </Button>
                  <Button variant="ghost" className="justify-start">
                    <Trophy className="mr-2 h-4 w-4" /> Leaderboard
                  </Button>
                  <Button variant="ghost" className="justify-start">
                    <Book className="mr-2 h-4 w-4" /> Resources
                  </Button>
                </nav>
              </CardContent>
            </Card>
          </div>
        </aside>

        {/* Main Feed */}
        <main className="lg:col-span-6">
          <div className="space-y-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <Avatar>
                    <AvatarImage src={users[0].avatarUrl} />
                    <AvatarFallback>{users[0].name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="w-full space-y-2">
                    <Textarea placeholder="Share something with the community..." />
                    <Button>Post</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            <div className="flex flex-col gap-6">
                {posts.map((post) => (
                    <PostCard key={post.id} post={post} />
                ))}
            </div>
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="lg:col-span-3">
          <div className="sticky top-20 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Contributors</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {topContributors.map((user) => (
                  <div key={user.id} className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatarUrl} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.title}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Community Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Members</span>
                  <span className="font-semibold">{community.memberCount.toLocaleString()}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Online</span>
                  <span className="font-semibold">
                    {Math.floor(community.memberCount / 20).toLocaleString()}
                  </span>
                </div>
                <Separator />
                 <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Category</span>
                  <span className="font-semibold">{community.category}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </aside>
      </div>
    </div>
  );
}
