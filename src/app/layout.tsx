import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import AuthProvider from '@/context/AuthProvider';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'YieldFeedback — Honest feedback. Zero names.',
  description:
    'Receive completely anonymous feedback from anyone. Share your link, collect honest opinions, and grow with zero friction.',
  openGraph: {
    title: 'YieldFeedback — Honest feedback. Zero names.',
    description:
      'Receive completely anonymous feedback from anyone. Share your link, collect honest opinions, and grow with zero friction.',
    siteName: 'YieldFeedback',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'YieldFeedback — Honest feedback. Zero names.',
    description:
      'Receive completely anonymous feedback from anyone. Share your link, collect honest opinions, and grow with zero friction.',
  },
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
