/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#3b82f6",
        "primary-foreground": "#ffffff",
        secondary: "#8b5cf6",
        "secondary-foreground": "#ffffff",
        destructive: "#ef4444",
        "destructive-foreground": "#ffffff",
        muted: "#f3f4f6",
        "muted-foreground": "#6b7280",
        background: "#ffffff",
        foreground: "#1f2937",
        border: "#e5e7eb",
        input: "#e5e7eb",
        ring: "#3b82f6",
      },
    },
  },
  plugins: [],
};

