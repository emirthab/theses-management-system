'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { BookOpenText, Users, Building2, Search, FileText, LetterText, Home } from 'lucide-react';
import { useRouter } from 'next/navigation';

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Submit Thesis', href: '/thesis/submit', icon: FileText },
  { name: 'Search Theses', href: '/thesis/search', icon: Search },
  { name: 'People', href: '/people', icon: Users },
  { name: 'University', href: '/university', icon: Building2 },
];


export function Navigation() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div onClick={() => router.replace("/")} className="flex items-center cursor-pointer">
            <BookOpenText className="h-8 w-8 text-primary" />
            <span className="ml-2 text-xl font-semibold">GTS</span>
          </div>
          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors',
                      pathname === item.href
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    )}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}