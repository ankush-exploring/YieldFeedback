'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Shield, Zap, ArrowRight } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

const sampleMessages = [
  {
    title: 'Career Feedback',
    content:
      'Your presentation skills have improved so much! You explain complex ideas with real clarity now.',
  },
  {
    title: 'Honest Opinion',
    content:
      "I think you should focus more on the product roadmap. The current priorities feel scattered.",
  },
  {
    title: 'Encouragement',
    content:
      'The way you handled that difficult client was incredibly professional. Keep it up!',
  },
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <svg
              width="32"
              height="32"
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
            <span className="text-xl font-bold tracking-tight">
              YieldFeedback
            </span>
          </Link>
          <nav className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/sign-in">
              <Button variant="ghost" size="sm">
                Sign in
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button size="sm">Get started</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-24 bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            <Zap className="h-3.5 w-3.5" />
            Powered by AI — Zero identities revealed
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-foreground">
            Honest feedback.{' '}
            <span className="bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">
              Zero names.
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Create your anonymous feedback link in seconds. Share it with
            friends, colleagues, or your audience — and receive brutally honest
            opinions without fear or filter.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Link href="/sign-up">
              <Button size="lg" className="gap-2 px-8">
                Create your link <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/sign-in">
              <Button size="lg" variant="outline" className="px-8">
                Sign in
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Sample Messages */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">
              See what people are saying
            </h2>
            <p className="text-muted-foreground text-lg">
              Real anonymous messages shared through YieldFeedback
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {sampleMessages.map((msg, i) => (
              <Card
                key={i}
                className="rounded-2xl shadow-sm hover:shadow-md transition-shadow border-border/60"
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-primary" />
                    {msg.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {msg.content}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto grid gap-8 md:grid-cols-3 text-center">
          {[
            {
              icon: <Shield className="h-7 w-7 text-primary mx-auto mb-3" />,
              title: 'Fully Anonymous',
              desc: 'Senders never reveal their identity. You get raw, unfiltered honesty.',
            },
            {
              icon: <Zap className="h-7 w-7 text-primary mx-auto mb-3" />,
              title: 'AI-Suggested Prompts',
              desc: 'Groq-powered LLM suggests relevant questions to get the feedback you actually need.',
            },
            {
              icon: (
                <MessageSquare className="h-7 w-7 text-primary mx-auto mb-3" />
              ),
              title: 'One Link, Infinite Insight',
              desc: 'Share a single link. Manage all feedback from your private dashboard.',
            },
          ].map((f, i) => (
            <div key={i} className="space-y-2">
              {f.icon}
              <h3 className="font-semibold text-lg">{f.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        <p>
          &copy; {new Date().getFullYear()} YieldFeedback. Honest feedback.
          Zero names.
        </p>
      </footer>
    </div>
  );
}
