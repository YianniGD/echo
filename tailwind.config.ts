
import type { Config } from 'tailwindcss';

const config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ['Noto Sans', 'sans-serif'],
        serif: ['Noto Sans', 'sans-serif'],
        geologica: ['Geologica', 'sans-serif'],
      },
      fontSize: {
        'display-lg': ['3.5625rem', { lineHeight: '4rem', letterSpacing: '0', fontWeight: '600' }],
        'display-md': ['2.8125rem', { lineHeight: '3.25rem', letterSpacing: '0', fontWeight: '600' }],
        'display-sm': ['2.25rem', { lineHeight: '2.75rem', letterSpacing: '0', fontWeight: '600' }],
        'headline-lg': ['2rem', { lineHeight: '2.5rem', letterSpacing: '0', fontWeight: '900' }],
        'headline-md': ['1.75rem', { lineHeight: '2.25rem', letterSpacing: '0', fontWeight: '900' }],
        'headline-sm': ['1.5rem', { lineHeight: '2rem', letterSpacing: '0', fontWeight: '900' }],
        'title-lg': ['1.375rem', { lineHeight: '1.75rem', letterSpacing: '0', fontWeight: '600' }],
        'title-md': ['1rem', { lineHeight: '1.5rem', letterSpacing: '0.01em', fontWeight: '600' }],
        'title-sm': ['0.875rem', { lineHeight: '1.25rem', letterSpacing: '0.01em', fontWeight: '600' }],
        'body-lg': ['1rem', { lineHeight: '1.5rem', letterSpacing: '0.01em', fontWeight: '400' }],
        'body-md': ['0.875rem', { lineHeight: '1.25rem', letterSpacing: '0.01em', fontWeight: '400' }],
        'body-sm': ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.02em', fontWeight: '400' }],
        'label-lg': ['0.875rem', { lineHeight: '1.25rem', letterSpacing: '0.02em', fontWeight: '500' }],
        'label-md': ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.03em', fontWeight: '500' }],
        'label-sm': ['0.6875rem', { lineHeight: '1rem', letterSpacing: '0.04em', fontWeight: '500' }],
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          container: 'hsl(var(--primary-container))',
          'on-container': 'hsl(var(--on-primary-container))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
          container: 'hsl(var(--secondary-container))',
          'on-container': 'hsl(var(--on-secondary-container))',
        },
        tertiary: {
          DEFAULT: 'hsl(var(--tertiary))',
          foreground: 'hsl(var(--on-tertiary))',
          container: 'hsl(var(--tertiary-container))',
          'on-container': 'hsl(var(--on-tertiary-container))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        error: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
          container: 'hsl(var(--error-container))',
          'on-container': 'hsl(var(--on-error-container))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        surface: {
          DEFAULT: 'hsl(var(--surface))',
          'on': 'hsl(var(--on-surface))',
          variant: 'hsl(var(--surface-variant))',
          'on-variant': 'hsl(var(--on-surface-variant))',
          'container-lowest': 'hsl(var(--surface-container-lowest))',
          'container-low': 'hsl(var(--surface-container-low))',
          container: 'hsl(var(--surface-container))',
          'container-high': 'hsl(var(--surface-container-high))',
          'container-highest': 'hsl(var(--surface-container-highest))',
        },
        outline: {
          DEFAULT: 'hsl(var(--outline))',
          variant: 'hsl(var(--outline-variant))',
        },
        scrim: 'hsl(var(--scrim))',
      },
      borderRadius: {
        'none': '0', 'xs': '0.125rem', 'sm': '0.25rem', 'DEFAULT': '0.375rem', 
        'md': '0.5rem', 'lg': '0.75rem', 'xl': '1rem', '2xl': '1.5rem', '3xl': '2rem', 'full': '9999px',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "sound-wave": {
            '0%': { transform: 'scaleY(0.3)' },
            '25%': { transform: 'scaleY(1)' },
            '50%': { transform: 'scaleY(0.6)' },
            '75%': { transform: 'scaleY(0.8)' },
            '100%': { transform: 'scaleY(0.3)' }
        },
        "wave": {
            '0%': { transform: 'scale(0.4)', opacity: '0.8', 'stroke-width': '2px' },
            '100%': { transform: 'scale(1.8)', opacity: '0', 'stroke-width': '0.5px' }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "sound-wave": "sound-wave 1.2s ease-in-out infinite",
        "wave": "wave 2s infinite"
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;

export default config;
