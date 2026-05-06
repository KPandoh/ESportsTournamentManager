/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#ff2e2e',
        background: '#050505',
        accent: '#ff4d4d'
      },
      animation: {
        'scanline': 'scanline 8s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        glow: {
          '0%': { boxShadow: '0 0 10px #ff2e2e, 0 0 20px #ff2e2e' },
          '100%': { boxShadow: '0 0 20px #ff4d4d, 0 0 30px #ff4d4d' }
        }
      }
    },
  },
  plugins: [],
}
