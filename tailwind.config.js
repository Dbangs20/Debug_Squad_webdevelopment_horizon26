/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Sora', 'sans-serif'],
        body: ['Space Grotesk', 'sans-serif'],
      },
      boxShadow: {
        neon: '0 0 0 1px rgba(56, 189, 248, 0.22), 0 0 20px rgba(56, 189, 248, 0.18)',
      },
      colors: {
        shell: '#05070f',
        panel: '#0c1220',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 0 1px rgba(34,211,238,0.18), 0 0 12px rgba(34,211,238,0.12)' },
          '50%': { boxShadow: '0 0 0 1px rgba(239,68,68,0.38), 0 0 24px rgba(239,68,68,0.35)' },
        },
      },
      animation: {
        pulseGlow: 'pulseGlow 1.8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
