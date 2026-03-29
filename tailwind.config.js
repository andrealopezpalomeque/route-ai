/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app.vue',
    './app/**/*.{vue,js,ts}',
    './components/**/*.{vue,js,ts}',
    './pages/**/*.{vue,js,ts}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0a0a0f',
        surface: 'rgba(255,255,255,0.03)',
        border: 'rgba(255,255,255,0.07)',
        'text-primary': '#ffffff',
        'text-secondary': '#888888',
        'text-muted': '#444444',
        accent: '#00ffb2',
        'accent-maps': '#1a73e8',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        mono: ['"Space Mono"', 'monospace'],
        body: ['"DM Sans"', 'sans-serif'],
      },
      maxWidth: {
        app: '640px',
      },
    },
  },
  plugins: [],
}
