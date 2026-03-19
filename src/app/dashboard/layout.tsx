'use client';

import { ReactNode } from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  Settings, 
  Wallet,
  Home,
  GraduationCap
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: ReactNode;
}

const sidebarLinks = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/enrolled-courses', label: 'Learning Path', icon: GraduationCap },
  { href: '/dashboard/courses', label: 'My Courses', icon: BookOpen },
  { href: '/dashboard/communities', label: 'My Communities', icon: Users },
  { href: '/dashboard/wallet', label: 'Wallet', icon: Wallet },
  { href: '/profile', label: 'Profile Settings', icon: Settings },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 min-h-[calc(100vh-10rem)]">
      {/* Sidebar Navigation */}
      <aside className="w-full lg:w-64 flex flex-col gap-2 shrink-0">
        <div className="bg-card border rounded-xl p-2 sticky top-24">
          <div className="px-4 py-3 mb-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Dashboard</h2>
          </div>
          <nav className="flex flex-col gap-1">
            {sidebarLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 py-2.5 text-sm font-medium transition-colors group",
                  isActive(link.href)
                    ? "bg-primary/10 text-primary font-semibold border-l-2 border-primary pl-3"
                    : "px-4 rounded-lg text-muted-foreground hover:bg-muted"
                )}
              >
                <link.icon className={cn(
                  "h-4 w-4 transition-colors",
                  isActive(link.href) ? "text-primary" : "text-muted-foreground group-hover:text-primary"
                )} />
                {link.label}
              </Link>
            ))}
            <div className="h-px bg-border my-2 mx-4" />
            <Link
              href="/"
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors hover:bg-muted text-muted-foreground"
            >
              <Home className="h-4 w-4" />
              Return Home
            </Link>
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0">
        <div className="bg-card border rounded-xl p-6 sm:p-8 shadow-sm min-h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
