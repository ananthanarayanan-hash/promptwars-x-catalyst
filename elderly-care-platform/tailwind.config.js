export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        clinical: { navy: '#0F172A', slate: '#1E293B', surface: '#F8FAFC', border: '#E2E8F0' },
        status: { taken: '#059669', upcoming: '#D97706', missed: '#DC2626' },
      },
    },
  },
  plugins: [],
};
