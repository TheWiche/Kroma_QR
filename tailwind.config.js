/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          base: '#0D0C0E',
          substrate: '#111012',
          surface: '#141315',
          panel: '#1A191E',
          card: '#201F21',
          module: '#242229',
          elevated: '#2B2832',
          highlight: '#363436',
          border: '#292524',
          hairline: 'rgba(244, 243, 239, 0.08)',
        },
        persimmon: {
          DEFAULT: '#E85A2A',
          hover: '#F06543',
          bright: '#F36232',
          light: '#FFB59E',
          dark: '#AE3200',
        },
        amber: {
          golden: '#F97316',
          sunset: '#FB923C',
          container: '#EC6A06',
        },
        editorial: {
          chalk: '#F4F3EF',
          stone: '#A8A29E',
          ash: '#6B6562',
        }
      },
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
      },
      boxShadow: {
        'amber-glow': '0 0 35px -5px rgba(232, 90, 42, 0.3)',
        'amber-sm': '0 0 15px rgba(232, 90, 42, 0.25)',
        'obsidian-elevated': '0 12px 36px -4px rgba(0, 0, 0, 0.65), 0 0 0 1px rgba(244, 243, 239, 0.08)',
      }
    },
  },
  plugins: [],
}

