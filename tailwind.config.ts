import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/app/**/*.{ts,tsx}',
    './src/lib/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    screens: {
      sm: '375px', // Mobile
      md: '768px', // Tablet
      lg: '1024px', // Desktop
      xl: '1440px', // Wide
    },
    fontFamily: {
      sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      mono: ['Menlo', 'monospace'],
    },
    fontSize: {
      xs: ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.01em' }], // 12px
      sm: ['0.875rem', { lineHeight: '1.25rem', letterSpacing: '0.008em' }], // 14px
      base: ['1rem', { lineHeight: '1.5rem', letterSpacing: '0' }], // 16px
      lg: ['1.125rem', { lineHeight: '1.75rem', letterSpacing: '0' }], // 18px
      xl: ['1.25rem', { lineHeight: '1.75rem', letterSpacing: '-0.01em' }], // 20px
      '2xl': ['1.5rem', { lineHeight: '2rem', letterSpacing: '-0.01em' }], // 24px
      '3xl': ['1.875rem', { lineHeight: '2.25rem', letterSpacing: '-0.02em' }], // 30px
      '4xl': ['2.25rem', { lineHeight: '2.5rem', letterSpacing: '-0.02em' }], // 36px
    },
    spacing: {
      0: '0',
      1: 'var(--spacing-xs)', // 4px
      2: 'var(--spacing-sm)', // 8px
      3: 'calc(var(--spacing-sm) + var(--spacing-xs))', // 12px
      4: 'var(--spacing-md)', // 16px
      5: 'calc(var(--spacing-md) + var(--spacing-xs))', // 20px
      6: 'calc(var(--spacing-md) + var(--spacing-sm))', // 24px
      7: 'calc(var(--spacing-md) + var(--spacing-md) - var(--spacing-sm))', // 28px
      8: 'calc(var(--spacing-md) * 2)', // 32px
      10: 'calc(var(--spacing-md) * 2.5)', // 40px
      12: 'calc(var(--spacing-md) * 3)', // 48px
      16: 'calc(var(--spacing-md) * 4)', // 64px
      20: 'calc(var(--spacing-md) * 5)', // 80px
      24: 'calc(var(--spacing-md) * 6)', // 96px
      32: 'calc(var(--spacing-md) * 8)', // 128px
    },
    borderRadius: {
      none: '0',
      xs: 'var(--radius-xs)', // 4px
      sm: 'var(--radius-sm)', // 6px
      md: 'var(--radius-md)', // 8px
      lg: 'var(--radius-lg)', // 12px
      full: '9999px',
    },
    extend: {
      colors: {
        // Base colors - semantic CSS variables
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',

        // Primary brand colors
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },

        // Semantic status colors for purchase/data intelligence
        success: {
          DEFAULT: 'var(--color-success)',
          light: 'var(--color-success-light)',
          dark: 'var(--color-success-dark)',
          foreground: 'var(--color-success-fg)',
        },
        warning: {
          DEFAULT: 'var(--color-warning)',
          light: 'var(--color-warning-light)',
          dark: 'var(--color-warning-dark)',
          foreground: 'var(--color-warning-fg)',
        },
        danger: {
          DEFAULT: 'var(--color-danger)',
          light: 'var(--color-danger-light)',
          dark: 'var(--color-danger-dark)',
          foreground: 'var(--color-danger-fg)',
        },
        info: {
          DEFAULT: 'var(--color-info)',
          light: 'var(--color-info-light)',
          dark: 'var(--color-info-dark)',
          foreground: 'var(--color-info-fg)',
        },

        // Neutral/grayscale for UI elements
        neutral: {
          50: 'var(--color-neutral-50)',
          100: 'var(--color-neutral-100)',
          200: 'var(--color-neutral-200)',
          300: 'var(--color-neutral-300)',
          400: 'var(--color-neutral-400)',
          500: 'var(--color-neutral-500)',
          600: 'var(--color-neutral-600)',
          700: 'var(--color-neutral-700)',
          800: 'var(--color-neutral-800)',
          900: 'var(--color-neutral-900)',
        },

        // Component-specific colors
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
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
      },

      boxShadow: {
        xs: 'var(--shadow-xs)',
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        xl: 'var(--shadow-xl)',
      },

      transitionDuration: {
        fast: 'var(--duration-fast)',
        normal: 'var(--duration-normal)',
        slow: 'var(--duration-slow)',
      },

      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'fade-out': {
          from: { opacity: '1' },
          to: { opacity: '0' },
        },
        'slide-in-from-top': {
          from: { transform: 'translateY(-10px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-in-from-bottom': {
          from: { transform: 'translateY(10px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
      },

      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.3s ease-in-out',
        'fade-out': 'fade-out 0.3s ease-in-out',
        'slide-in-from-top': 'slide-in-from-top 0.3s ease-out',
        'slide-in-from-bottom': 'slide-in-from-bottom 0.3s ease-out',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

export default config;
