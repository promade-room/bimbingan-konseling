/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#f8fafc',
          surface: '#ffffff',
          card: '#ffffff',
          primary: '#0891b2',
          'primary-dark': '#0e7490',
          'primary-light': '#cffafe',
          secondary: '#059669',
          'secondary-light': '#d1fae5',
          accent: '#f59e0b',
          'accent-light': '#fef3c7',
          success: '#10b981',
          danger: '#ef4444',
          warning: '#f59e0b',
          text: '#1e293b',
          muted: '#64748b',
          border: '#e2e8f0',
          'border-dark': '#cbd5e1',
          sidebar: '#0f172a',
          'sidebar-text': '#cbd5e1',
          'sidebar-active': '#0891b2'
        }
      },
      fontFamily: {
        heading: ['Inter', 'sans-serif'],
        body: ['Inter', 'sans-serif']
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        'card-hover': '0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.04)',
        sidebar: '0 0 15px rgba(0,0,0,0.1)'
      }
    }
  },
  plugins: []
}
