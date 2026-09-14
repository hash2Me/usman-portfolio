/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        slate: {
          950: '#000000',
          900: '#111111',
          800: '#222222',
          700: '#333333',
          600: '#444444',
          500: '#666666',
          400: '#888888',
          300: '#aaaaaa',
          200: '#cccccc',
          100: '#eeeeee',
          50: '#f5f5f5',
        },
        accent: {
          DEFAULT: '#000000',
          hover: '#222222',
          subtle: '#eeeeee',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'SFMono-Regular', 'monospace'],
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
      },
      maxWidth: {
        content: '72rem',
      },
      spacing: {
        18: '4.5rem',
        22: '5.5rem',
      },
      boxShadow: {
        hard: '4px 4px 0px 0px rgba(0,0,0,1)',
        'hard-hover': '6px 6px 0px 0px rgba(0,0,0,1)',
        'hard-sm': '2px 2px 0px 0px rgba(0,0,0,1)',
      },
      borderRadius: {
        DEFAULT: '0px',
        lg: '0px',
        full: '9999px',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-60px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(60px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        fadeUp: 'fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        fadeIn: 'fadeIn 0.6s ease-out forwards',
        slideInLeft: 'slideInLeft 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        slideInRight: 'slideInRight 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        scaleIn: 'scaleIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        marquee: 'marquee 30s linear infinite',
      },
    },
  },
  plugins: [],
};
