/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#0a0a1a',
          surface: '#111128',
          card: '#1a1a3e',
          primary: '#00f0ff',
          secondary: '#ff00aa',
          accent: '#f5f500',
          success: '#00ff88',
          danger: '#ff3366',
          text: '#e0e0e0',
          muted: '#8888aa',
          border: '#2a2a5e'
        }
      },
      fontFamily: {
        heading: ['Orbitron', 'sans-serif'],
        body: ['Rajdhani', 'sans-serif']
      },
      boxShadow: {
        neon: '0 0 5px rgba(0, 240, 255, 0.5), 0 0 20px rgba(0, 240, 255, 0.2)',
        'neon-pink': '0 0 5px rgba(255, 0, 170, 0.5), 0 0 20px rgba(255, 0, 170, 0.2)',
        'neon-green': '0 0 5px rgba(0, 255, 136, 0.5), 0 0 20px rgba(0, 255, 136, 0.2)'
      }
    }
  },
  plugins: []
}
