import { Mountain } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <Link href="/" className="flex items-center space-x-2">
            <Mountain className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">SkillConnect</span>
          </Link>
          <p className="text-sm text-muted-foreground">
            Skill exchange + community-driven learning.
          </p>
          <p className="text-xs text-muted-foreground/60">
            © 2026 SkillConnect, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
