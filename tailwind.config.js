/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#08080e',
        surface: '#111118',
        border: 'rgba(255,255,255,0.06)',
        domain: {
          consumidor: '#e879f9',
          canales: '#38bdf8',
          tecnologia: '#a78bfa',
          margen: '#fb923c',
          competencia: '#f87171',
          finanzas: '#facc15',
          coherencia: '#4af0c8',
          operaciones: '#94a3b8',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
