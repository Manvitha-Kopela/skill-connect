'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/hooks/use-user';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Coins, ArrowUpRight, ArrowDownLeft, History, Loader2, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format, formatDistanceToNow } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * @fileOverview User Wallet Dashboard.
 * Displays balance, stats, and safe transaction history.
 */

export default function WalletPage() {
  const { user, isLoading: userLoading, refreshUser } = useUser();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const { toast } = useToast();

  const fetchWalletData = async () => {
    try {
      const res = await fetch('/api/wallet/transactions');
      if (res.ok) {
        const data = await res.json();
        setTransactions(data);
      }
    } catch (error) {
      console.error("Failed to fetch wallet history", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchWalletData();
  }, [user]);

  const handleDailyCheckin = async () => {
    setClaiming(true);
    try {
      const res = await fetch('/api/auth/daily-checkin', { method: 'POST' });
      const data = await res.json();
      
      if (res.ok) {
        toast({
          title: "Success!",
          description: data.message,
        });
        await refreshUser();
        await fetchWalletData();
      } else {
        // Specific handling for "Come back tomorrow" (400)
        toast({
          variant: res.status === 400 ? "default" : "destructive",
          title: res.status === 400 ? "Note" : "Error",
          description: data.message || "Failed to collect reward.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to connect to server.",
      });
    } finally {
      setClaiming(false);
    }
  };

  const formatDateSafe = (dateStr?: string) => {
    if (!dateStr) return 'Recently';
    const date = new Date(dateStr);
    return !isNaN(date.getTime()) ? format(date, 'MMM d, yyyy • h:mm a') : 'Recently';
  };

  if (userLoading || loading) {
    return <div className="space-y-6">
      <Skeleton className="h-40 w-full rounded-2xl" />
      <Skeleton className="h-96 w-full rounded-2xl" />
    </div>;
  }

  const totalEarned = transactions
    .filter(t => t.amount > 0)
    .reduce((acc, t) => acc + t.amount, 0);
    
  const totalSpent = Math.abs(transactions
    .filter(t => t.amount < 0)
    .reduce((acc, t) => acc + t.amount, 0));

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">My Wallet</h1>
          <p className="text-muted-foreground">Track your coins and learning investments.</p>
        </div>
        <Button 
          onClick={handleDailyCheckin} 
          disabled={claiming}
          className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold shadow-lg h-12 px-6 rounded-xl transition-all active:scale-95"
        >
          {claiming ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Sparkles className="mr-2 h-5 w-5" />}
          Claim Daily Reward
        </Button>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-12">
        <Card className="md:col-span-7 bg-primary text-primary-foreground border-none shadow-xl relative overflow-hidden rounded-3xl">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Coins className="h-40 w-40" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-widest opacity-70">Current Balance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-2 rounded-2xl">
                <Coins className="h-8 w-8 text-yellow-400" />
              </div>
              <span className="text-6xl font-black tabular-nums">{user?.coinBalance || 0}</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl inline-block">
              <p className="text-xs font-bold leading-relaxed opacity-90">
                Enroll in expert courses or earn rewards by contributing to the community.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-5 flex flex-col justify-center rounded-3xl border-primary/5 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Lifetime Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-between items-center p-3 rounded-2xl bg-green-500/5 border border-green-500/10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <ArrowUpRight className="h-4 w-4 text-green-600" />
                </div>
                <span className="text-sm font-bold text-muted-foreground">Total Earned</span>
              </div>
              <span className="font-black text-green-600">+{totalEarned}</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-2xl bg-red-500/5 border border-red-500/10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-500/10 rounded-lg">
                  <ArrowDownLeft className="h-4 w-4 text-red-600" />
                </div>
                <span className="text-sm font-bold text-muted-foreground">Total Invested</span>
              </div>
              <span className="font-black text-red-600">-{totalSpent}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-3xl border-primary/5 shadow-sm overflow-hidden">
        <CardHeader className="flex flex-row items-center gap-3 border-b bg-muted/20 py-6">
          <div className="p-2 bg-primary/10 rounded-lg">
            <History className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold">Transaction History</CardTitle>
            <CardDescription>Your recent coin activities</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {transactions.length === 0 ? (
            <div className="py-20 text-center space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <Coins className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <p className="font-bold text-muted-foreground">No history yet</p>
                <p className="text-sm text-muted-foreground/60">Start earning coins today!</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleDailyCheckin} className="rounded-full font-bold">
                Check-in Now
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-border/50">
              {transactions.map((t) => (
                <div key={t.id} className="p-5 flex items-center justify-between hover:bg-muted/30 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-2xl transition-transform group-hover:scale-110 ${t.amount > 0 ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'}`}>
                      {t.amount > 0 ? <ArrowUpRight className="h-5 w-5" /> : <ArrowDownLeft className="h-5 w-5" />}
                    </div>
                    <div>
                      <p className="font-bold text-base leading-tight">{t.reason}</p>
                      <p className="text-xs text-muted-foreground mt-1 font-medium">{formatDateSafe(t.createdAt)}</p>
                    </div>
                  </div>
                  <div className={`text-lg font-black tabular-nums ${t.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {t.amount > 0 ? '+' : ''}{t.amount}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
