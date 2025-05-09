import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "#121212", // Dark background
        foreground: "#E0F2E9", // Light green foreground
        primary: {
          DEFAULT: "#00FF00", // Green primary color
          foreground: "#003300", // Dark green foreground
        },
        secondary: {
          DEFAULT: "#006400", // Secondary green
          foreground: "#E0F2E9", // Light green foreground
        },
        destructive: {
          DEFAULT: "#FF0000", // Red for destructive actions
          foreground: "#330000", // Dark red foreground
        },
        muted: {
          DEFAULT: "#2E2E2E", // Muted dark gray
          foreground: "#A9A9A9", // Muted light gray
        },
        accent: {
          DEFAULT: "#32CD32", // Lime green accent
          foreground: "#003300", // Dark green foreground
        },
        popover: {
          DEFAULT: "#1C1C1C", // Popover dark gray
          foreground: "#E0F2E9", // Light green foreground
        },
        card: {
          DEFAULT: "#1E1E1E", // Card dark gray
          foreground: "#E0F2E9", // Light green foreground
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
