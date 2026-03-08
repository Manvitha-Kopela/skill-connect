'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/hooks/use-user';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { 
  User as UserIcon, 
  Lock, 
  Shield, 
  Coins, 
  Star, 
  BookOpen, 
  Users,
  Calendar,
  Loader2
} from 'lucide-react';

interface ProfileData {
  id: string;
  name: string;
  email: string;
  role: string;
  coinBalance: number;
  streak: number;
  createdAt: string;
  stats: {
    courseCount: number;
    communityCount: number;
  };
}

export default function ProfilePage() {
  const { user: authUser, refreshUser } = useUser();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const { toast } = useToast();

  // Form states
  const [name, setName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch('/api/profile/me');
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
          setName(data.name);
        }
      } catch (error) {
        console.error("Failed to fetch profile", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const res = await fetch('/api/profile/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (res.ok) {
        toast({ title: "Success", description: "Profile updated successfully." });
        setProfile(prev => prev ? { ...prev, name: data.user.name } : null);
        refreshUser();
      } else {
        toast({ variant: "destructive", title: "Update Failed", description: data.message });
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to update profile." });
    } finally {
      setUpdating(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast({ variant: "destructive", title: "Error", description: "Passwords do not match." });
      return;
    }
    setUpdating(true);
    try {
      const res = await fetch('/api/profile/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        toast({ title: "Success", description: "Password changed successfully." });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        toast({ variant: "destructive", title: "Error", description: data.message });
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to change password." });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <Skeleton className="h-40 w-full rounded-xl" />
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Profile Header */}
      <div className="relative overflow-hidden rounded-2xl bg-primary p-6 sm:p-10 text-primary-foreground">
        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6">
          <Avatar className="h-24 w-24 border-4 border-white/20">
            <AvatarImage src={`https://picsum.photos/seed/${profile.id}/100/100`} />
            <AvatarFallback className="bg-white/10 text-4xl">{profile.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="text-center sm:text-left space-y-2">
            <h1 className="text-3xl font-extrabold">{profile.name}</h1>
            <p className="text-primary-foreground/80 flex items-center justify-center sm:justify-start gap-2">
              <Shield className="h-4 w-4" /> {profile.role}
            </p>
            <p className="text-primary-foreground/70 text-sm flex items-center justify-center sm:justify-start gap-2">
              <Calendar className="h-4 w-4" /> Joined {format(new Date(profile.createdAt), 'MMMM yyyy')}
            </p>
          </div>
          <div className="sm:ml-auto grid grid-cols-2 gap-4">
             <div className="bg-white/10 backdrop-blur px-4 py-3 rounded-xl text-center">
                <p className="text-xs uppercase tracking-wider font-bold opacity-70">Balance</p>
                <div className="flex items-center justify-center gap-1.5 mt-1">
                  <Coins className="h-4 w-4 text-yellow-400" />
                  <span className="text-lg font-black">{profile.coinBalance}</span>
                </div>
             </div>
             <div className="bg-white/10 backdrop-blur px-4 py-3 rounded-xl text-center">
                <p className="text-xs uppercase tracking-wider font-bold opacity-70">Streak</p>
                <div className="flex items-center justify-center gap-1.5 mt-1">
                  <Star className="h-4 w-4 text-orange-400" />
                  <span className="text-lg font-black">{profile.streak}</span>
                </div>
             </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-12">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="edit">Edit Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6 space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <Card>
              <CardHeader className="flex flex-row items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <BookOpen className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <CardTitle className="text-base">Courses Enrolled</CardTitle>
                  <CardDescription>Courses you're currently learning</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-black">{profile.stats.courseCount}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center gap-3">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <Users className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <CardTitle className="text-base">Communities Joined</CardTitle>
                  <CardDescription>Groups you participate in</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-black">{profile.stats.communityCount}</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Account Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="flex justify-between items-center py-2 border-b">
                 <span className="text-muted-foreground text-sm">Full Name</span>
                 <span className="font-medium">{profile.name}</span>
               </div>
               <div className="flex justify-between items-center py-2 border-b">
                 <span className="text-muted-foreground text-sm">Email Address</span>
                 <span className="font-medium">{profile.email}</span>
               </div>
               <div className="flex justify-between items-center py-2 border-b">
                 <span className="text-muted-foreground text-sm">Current Role</span>
                 <span className="font-medium">{profile.role}</span>
               </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="edit" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Update Information</CardTitle>
              <CardDescription>Manage your public profile details.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Display Name</Label>
                  <Input 
                    id="name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    placeholder="Enter your name"
                  />
                </div>
                <div className="space-y-2 opacity-50">
                  <Label htmlFor="email">Email (Cannot be changed)</Label>
                  <Input id="email" value={profile.email} disabled />
                </div>
                <Button type="submit" disabled={updating}>
                  {updating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Changes
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your password to keep your account secure.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current">Current Password</Label>
                  <Input 
                    id="current" 
                    type="password" 
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new">New Password</Label>
                  <Input 
                    id="new" 
                    type="password" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm">Confirm New Password</Label>
                  <Input 
                    id="confirm" 
                    type="password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>
                <Button type="submit" disabled={updating} variant="destructive">
                  {updating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Update Password
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
