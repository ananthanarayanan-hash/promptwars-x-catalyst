/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        clinical: {
          dark: '#0F172A',     // Slate-900
          accent: '#1E293B',   // Slate-800
          border: '#334155',   // Slate-700
          light: '#F8FAFC',    // Slate-50
          card: '#FFFFFF',
        },
        status: {
          taken: '#059669',    // Emerald Green
          'taken-bg': '#ECFDF5',
          'taken-border': '#10B981',
          upcoming: '#D97706', // Amber Yellow
          'upcoming-bg': '#FFFBEB',
          'upcoming-border': '#F59E0B',
          missed: '#DC2626',   // Crimson Red
          'missed-bg': '#FEF2F2',
          'missed-border': '#EF4444',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
