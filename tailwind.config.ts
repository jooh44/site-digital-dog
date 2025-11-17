import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary-blue': '#00bcd4',
        'dark-blue': '#0a0e1a',
        'darker-blue': '#03050a',
        'light-blue': '#4dd0e1',
        'glow-blue': 'rgba(0, 188, 212, 0.5)',
        'gradient-orange': '#ff6b35',
        'gradient-pink': '#ff1744',
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'Poppins', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
      },
      spacing: {
        'md': '1rem',
        'lg': '1.5rem',
        'xl': '2rem',
        '2xl': '3rem',
        '3xl': '4rem',
      },
      borderRadius: {
        'lg': '0.75rem',
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        'card': '0 10px 40px rgba(0, 0, 0, 0.2), 0 0 30px rgba(0, 188, 212, 0.1)',
        'card-hover': '0 20px 60px rgba(0, 0, 0, 0.3), 0 0 40px rgba(0, 188, 212, 0.3)',
      },
    },
  },
  plugins: [],
}
export default config

