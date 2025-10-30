/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'background': '#18181b',
        'foreground': '#f8fafc',
        'card': '#27272a',
        'card-foreground': '#f8fafc',
        'popover': '#27272a',
        'popover-foreground': '#f8fafc',
        'primary': '#3b82f6',
        'primary-foreground': '#f8fafc',
        'secondary': '#64748b',
        'secondary-foreground': '#f8fafc',
        'muted': '#3f3f46',
        'muted-foreground': '#a1a1aa',
        'accent': '#3f3f46',
        'accent-foreground': '#f8fafc',
        'destructive': '#ef4444',
        'destructive-foreground': '#f8fafc',
        'border': '#3f3f46',
        'input': '#3f3f46',
        'ring': '#3b82f6',
      },
    },
  },
  plugins: [],
}
