/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
        custom: "1440px",
      },
    },
    extend: {
      colors: {
        dark: "#0D0B32",
        "dark-0.7": "rgba(13, 11, 50, 0.7)",
        "dark-blue": "#151245",
        white: "#ffffff",
        "blue-border": "#1D1776",
        "dark-pink": "#f7405e",
        "light-gray": "#e8e8e8",
        purple: "#ff149d",
        "purple-light": "#ff149db3",
        "purple-0.15": "rgba(75,52,167, 0.15)",
        "purple-0.5": "rgba(75,52,167, 0.5)",
        pink: "#F205B3",
        darkBlue: "#060273",
        darkBlue2: "#0B0833",
        "dark-blue-0.4": "#4B34A7",
        blue1: "#035AA6",
        blue2: "#049DD9",
        green: "#22AD5C",
        red: "#F23030",
        yellow: "#fa933e",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#FFEDC2",
        },
        "light-green": "#80EED3",
        secondary: {
          DEFAULT: "#f7405e",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
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
        movingLine: {
          "0%": { opacity: "0", width: "0%" },
          "33.3%, 66%": { opacity: "0.8", width: "100%" },
          "85%": { width: "0%", right: "0", opacity: "1" },
          "100%": { opacity: "0", width: "0%" },
        },
        moveLetters: {
          "0%": { transform: "translateX(-15vw)", opacity: "0" },
          "33.3%, 66%": { transform: "translateX(0)", opacity: "1" },
          "100%": { transform: "translateX(15vw)", opacity: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        movingLine: "movingLine 2.4s infinite ease-in-out",
        moveLetters: "moveLetters 2.4s infinite ease-in-out",
      },
      fontFamily: {
        primary: ['"MS Sans Serif Bold"', "sans-serif"],
        secondary: ['"Saira"', "sans-serif"],
        tertiary: ['"Press Start 2P"'],
        MS: ['"MS Sans Serif 1"', "sans-serif"],
      },
      boxShadow: {
        "btn-shadow": "1px 1px rgba(0, 0, 0, 1)",
        "btn-shadow-active": "1.5px 1.5px black inset",
        "card-shadow": "1.5px 1.5px rgba(0, 0, 0, 1)",
        "heading-shadow": "0px 1px rgba(255, 255, 255)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
