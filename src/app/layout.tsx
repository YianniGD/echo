
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'echo',
  description: 'A calm, introspective journal to organize your thoughts, track your well-being, and reflect on your daily life.',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#9D7CBF" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Geologica:wght@500&family=Noto+Sans:wght@400;500;600;700&family=Noto+Serif:ital,wght@0,400;0,600;0,900;1,400;1,600&display=swap" rel="stylesheet" />
      </head>
      <body>
          {children}
          <Toaster />
      </body>
    </html>
  );
}
