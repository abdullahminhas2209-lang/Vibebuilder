/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#14161f",
        "ink-raised": "#1c1f2b",
        paper: "#f6f3ea",
        "paper-line": "#e4dfd0",
        amber: "#f2a93b",
        "amber-deep": "#d98f22",
        fog: "#9aa0ae",
        "fog-dim": "#6b7180",
        "slate-line": "#2b2f3c",
        cream: "#f2f0e8",
        border: "#2b2f3c",
        background: "#14161f",
        foreground: "#f2f0e8",
      },
      fontFamily: {
        serif: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-ibm-plex-sans)", "-apple-system", "sans-serif"],
        mono: ["var(--font-ibm-plex-mono)", "Courier New", "monospace"],
      },
      borderRadius: {
        sm: "3px",
        md: "6px",
        lg: "6px",
        xl: "6px",
        "2xl": "6px",
        "3xl": "6px",
      },
    },
  },
  plugins: [],
};
