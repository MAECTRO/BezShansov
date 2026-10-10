/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          950: '#060504',
          900: '#0C0A09',
          850: '#13110F',
          800: '#181513',
          700: '#26221E',
          600: '#38322C',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
      },
      backgroundImage: {
        'amber-spotlight': 'radial-gradient(ellipse at center, rgba(180,83,9,0.14), transparent 70%)',
        'gold-gradient': 'linear-gradient(135deg, #FDE68A 0%, #F59E0B 50%, #D97706 100%)',
        'holo-stripe': 'linear-gradient(90deg, rgba(99,102,241,0.4) 0%, rgba(236,72,153,0.4) 25%, rgba(251,191,36,0.5) 50%, rgba(52,211,153,0.4) 75%, rgba(99,102,241,0.4) 100%)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        }
      },
      animation: {
        shimmer: 'shimmer 3s infinite linear',
        pulseGlow: 'pulseGlow 2s infinite ease-in-out',
        wiggle: 'wiggle 0.5s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
