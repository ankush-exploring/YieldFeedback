'use client';

import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from './ui/button';
import { User } from 'next-auth';

function Navbar() {
  const { data: session } = useSession();
  const user: User = session?.user as User;

  return (
    <nav className="sticky top-0 z-50 border-b border-border/40 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <svg
            width="28"
            height="28"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="YieldFeedback logo"
          >
            <rect width="32" height="32" rx="8" fill="hsl(243,75%,59%)" />
            <path
              d="M8 10 L16 22 L24 10"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <circle cx="16" cy="22" r="2.5" fill="hsl(158,64%,52%)" />
          </svg>
          <span className="text-lg font-bold tracking-tight group-hover:text-primary transition-colors">
            YieldFeedback
          </span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {session ? (
            <>
              <span className="hidden sm:block text-sm text-muted-foreground">
                Welcome,{' '}
                <span className="font-medium text-foreground">
                  {user?.username ?? user?.email}
                </span>
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => signOut({ callbackUrl: '/' })}
              >
                Sign out
              </Button>
            </>
          ) : (
            <Link href="/sign-in">
              <Button size="sm">Sign in</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
