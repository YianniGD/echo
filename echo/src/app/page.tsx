'use client';

import { useRouter } from 'next/navigation';
import ActionButton from '@/components/echo/ActionButton';
import { Cloud, Edit3, Clipboard, Calendar, Sunrise, Waves, MinusCircle } from 'lucide-react';
import React, { useState, useEffect, useCallback } from 'react';
import ThemeToggleButton from '@/components/echo/ThemeToggleButton';
import type { Theme, Palette } from '@/lib/types';
import { LOCAL_STORAGE_KEY_THEME } from '@/lib/constants';
import { loadTheme } from '@/lib/services/storageService';
import { Badge } from '@/components/ui/badge';

const features = [
  { icon: <Sunrise className="w-6 h-6"/>, title: "Affirmations", description: "Start your day with positivity and reinforce empowering beliefs." },
  { icon: <Edit3 className="w-6 h-6"/>, title: "Journaling", description: "Capture your thoughts and organize your life." },
  { icon: <Clipboard className="w-6 h-6"/>, title: "Thought Records", description: "Use CBT-based tools to challenge and reframe unhelpful thought patterns." },
  { icon: <Calendar className="w-6 h-6"/>, title: "Planner & Calendar", description: "Organize your life, track goals, and view your entries in a calendar." },
  { icon: <MinusCircle className="transform rotate-90 w-6 h-6" />, title: "Medication Tracker", description: "Log medications and create bundles for easy tracking." },
];

export default function LandingPage() {
  const router = useRouter();
  const [theme, setTheme] = useState<Theme | null>(null);
  const [palette, setPalette] = useState<Palette | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem(LOCAL_STORAGE_KEY_THEME) as Theme | null;
    setTheme(storedTheme || 'light');
    setPalette(loadTheme());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !theme || !palette) return;
    const root = document.documentElement;
    root.classList.remove('theme-echo', 'theme-forest', 'theme-buttercup', 'theme-sunset');
    root.classList.add(`theme-${palette}`);
    root.classList.toggle('dark', theme === 'dark');
    localStorage.setItem(LOCAL_STORAGE_KEY_THEME, theme);
  }, [theme, palette, mounted]);

  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  }, []);

  const handleGuestMode = () => {
    router.push('/app');
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <main className="max-w-5xl w-full text-center">
        <div className="flex items-center justify-center space-x-4 mb-6">
          <Cloud className="w-16 h-16 sm:w-20 sm:h-20 text-primary" />
          <h1 className="font-geologica font-medium text-6xl sm:text-7xl text-primary">echo</h1>
        </div>
        <p className="font-serif text-headline-sm sm:text-headline-md text-surface-on max-w-3xl mx-auto">
          A calm, introspective space to organize your thoughts, track your well-being, and reflect on your daily life.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <ActionButton onClick={handleGuestMode} size="lg" variant="filled">
            Enter App
          </ActionButton>
        </div>

        <section className="mt-20 py-12 md:py-16">
            <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16">
                <div className="relative z-10 mx-auto max-w-3xl space-y-4 text-center">
                    <h2 className="font-serif text-headline-lg text-surface-on">
                        All The Tools You Need To Reflect and Grow
                    </h2>
                    <p className="text-body-lg text-surface-on-variant">
                        From structured CBT exercises to a freeform journal, Echo provides a comprehensive toolkit for your mental wellness journey.
                    </p>
                </div>

                <div className="grid gap-x-8 gap-y-12 md:grid-cols-3">
                    {features.map((feature, index) => (
                        <div key={index} className="space-y-3 text-center">
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary-container text-primary">
                              {feature.icon}
                            </div>
                            <div className="flex items-center justify-center gap-2">
                              <h3 className="font-serif text-title-lg text-surface-on">{feature.title}</h3>
                            </div>
                            <p className="text-body-md text-surface-on-variant">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
      </main>

      <footer className="mt-16 text-center text-sm text-surface-on-variant">
        <p>&copy; {new Date().getFullYear()} echo. All rights reserved.</p>
        <p className="mt-2">This is a prototype application. All data is stored in your browser only.</p>
      </footer>
      
      {theme && <ThemeToggleButton currentTheme={theme} onToggleTheme={toggleTheme} />}
    </div>
  );
}
