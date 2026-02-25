'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/use-user';
import { Loader2 } from 'lucide-react';

export default function EnrollmentButton({ courseId }: { courseId: string }) {
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const { toast } = useToast();
  const router = useRouter();

  const handleEnroll = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/courses/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Successfully Enrolled!',
          description: 'Coins have been deducted from your wallet.',
        });
        router.refresh();
      } else {
        toast({
          variant: 'destructive',
          title: 'Enrollment Failed',
          description: data.message || 'Something went wrong.',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to complete enrollment.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      size="lg" 
      className="w-full font-bold h-12 text-base" 
      onClick={handleEnroll}
      disabled={loading}
    >
      {loading ? (
        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enrolling...</>
      ) : (
        'Enroll Now'
      )}
    </Button>
  );
}
