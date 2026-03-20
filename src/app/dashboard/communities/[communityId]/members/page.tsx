'use client';

import { useState, useEffect, use } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Loader2, UserPlus, UserMinus, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

export default function ManageMembersPage({ params }: { params: Promise<{ communityId: string }> }) {
  const { communityId } = use(params);
  const { toast } = useToast();
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);

  const fetchMembers = async () => {
    try {
      const res = await fetch(`/api/communities/${communityId}/members`);
      if (res.ok) setMembers(await res.json());
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to load members' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMembers(); }, [communityId]);

  const handleAction = async (memberId: string, action: 'promote' | 'remove') => {
    setActionId(memberId);
    try {
      const res = await fetch(`/api/communities/${communityId}/members/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memberId })
      });

      if (res.ok) {
        toast({ title: 'Success', description: `Member ${action === 'promote' ? 'promoted' : 'removed'}` });
        fetchMembers();
      } else {
        const data = await res.json();
        throw new Error(data.message || 'Action failed');
      }
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    } finally {
      setActionId(null);
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
          <CardTitle>Member Management</CardTitle>
          <CardDescription>View all members and manage their roles in the tribe</CardDescription>
        </CardHeader>
        <CardContent className="divide-y divide-border">
          {members.map((member) => (
            <div key={member.id} className="flex items-center justify-between py-4 group">
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src={`https://picsum.photos/seed/${member.user.id}/100/100`} />
                  <AvatarFallback>{member.user.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{member.user.name}</span>
                    <Badge variant={member.role === 'ADMIN' ? 'default' : 'secondary'}>{member.role}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{member.user.email}</p>
                </div>
              </div>
              
              {member.role !== 'ADMIN' && (
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => handleAction(member.user.id, 'promote')}
                    disabled={actionId === member.user.id}
                  >
                    <ShieldCheck className="mr-2 h-4 w-4" /> Promote
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleAction(member.user.id, 'remove')}
                    disabled={actionId === member.user.id}
                  >
                    <UserMinus className="mr-2 h-4 w-4" /> Remove
                  </Button>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
