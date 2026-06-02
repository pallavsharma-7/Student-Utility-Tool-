/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FCFAF7',
          100: '#FAF8F4',
          200: '#F5F0E6',
          300: '#EDE5D5',
          400: '#E0D4BE',
          DEFAULT: '#FAF8F5',
        },
        brand: {
          dark: '#1E1E1E',
          charcoal: '#121212',
          yellow: '#F5C518',
          yellowLight: '#FDF7E2',
          beige: '#EBE6DD',
          muted: '#8A8A86',
          border: '#E8E3D9',
        }
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft-sm': '0 2px 8px -2px rgba(30, 30, 30, 0.04)',
        'soft-md': '0 4px 20px -4px rgba(30, 30, 30, 0.06)',
        'soft-lg': '0 10px 30px -10px rgba(30, 30, 30, 0.08)',
      }
    },
  },
  plugins: [],
}
