/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1a2e4a',
          dark: '#132238',
          light: '#243d5c',
        },
        gold: {
          DEFAULT: '#c9a84c',
          light: '#d4b86a',
          dark: '#b8922e',
        },
        sidebar: '#12223a',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
        overlayIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        overlayOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        dialogIn: {
          '0%': { opacity: '0', transform: 'translateY(16px) scale(0.94)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        dialogOut: {
          '0%': { opacity: '1', transform: 'translateY(0) scale(1)' },
          '100%': { opacity: '0', transform: 'translateY(8px) scale(0.96)' },
        },
        iconNudge: {
          '0%, 100%': { transform: 'translateX(0)' },
          '35%': { transform: 'translateX(4px)' },
          '65%': { transform: 'translateX(-1px)' },
        },
        ringPulse: {
          '0%': { opacity: '0.6', transform: 'scale(0.85)' },
          '100%': { opacity: '0', transform: 'scale(1.45)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.2s ease-out',
        fadeInUp: 'fadeInUp 0.25s ease-out',
        scaleIn: 'scaleIn 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
        slideInRight: 'slideInRight 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        slideDown: 'slideDown 0.18s ease-out',
        shimmer: 'shimmer 1.6s ease-in-out infinite',
        overlayIn: 'overlayIn 0.22s ease-out both',
        overlayOut: 'overlayOut 0.2s ease-in both',
        dialogIn: 'dialogIn 0.34s cubic-bezier(0.34, 1.36, 0.64, 1) both',
        dialogOut: 'dialogOut 0.2s cubic-bezier(0.4, 0, 1, 1) both',
        iconNudge: 'iconNudge 0.7s ease-in-out 0.3s both',
        ringPulse: 'ringPulse 1.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s 2',
      },
    },
  },
  plugins: [],
}