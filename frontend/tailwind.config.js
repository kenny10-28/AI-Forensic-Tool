/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'forensic-dark': '#0f1419',
        'forensic-gray': '#1a1f2e',
        'forensic-slate': '#2a3142',
        'security-blue': '#3b82f6',
        'threat-red': '#ef4444',
        'safe-green': '#10b981',
      },
    },
  },
  plugins: [],
}
