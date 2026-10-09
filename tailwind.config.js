/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        plum: {
          900: '#0d0417',
          800: '#1a0b2e',
          700: '#26123e',
          600: '#3d1d60',
        },
        rose: {
          hot: '#ff4d8d',
          glow: '#ff2d78',
          soft: '#ff75a0',
          blush: '#ffd6e7',
          petal: '#fff0f6',
        },
        gold: {
          accent: '#ffcf6b',
          glow: '#ffd700',
          light: '#fff3b0',
        }
      },
      fontFamily: {
        script: ['"Dancing Script"', '"Great Vibes"', 'cursive'],
        sans: ['"Outfit"', '"Poppins"', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float-slow': 'float 6s ease-in-out infinite',
        'sparkle': 'sparkle 2s ease-in-out infinite',
        'glow': 'glow 2.5s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-14px) rotate(3deg)' },
        },
        sparkle: {
          '0%, 100%': { opacity: '0.3', transform: 'scale(0.8)' },
          '50%': { opacity: '1', transform: 'scale(1.2)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 15px rgba(255, 77, 141, 0.4)' },
          '100%': { boxShadow: '0 0 35px rgba(255, 77, 141, 0.85), 0 0 15px rgba(255, 207, 107, 0.6)' },
        }
      }
    },
  },
  plugins: [],
}
