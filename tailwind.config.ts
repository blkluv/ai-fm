import type {Config} from "tailwindcss";

import {heroui} from "@heroui/react";

export default {
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}", "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
          "Noto Color Emoji",
        ],
      },
    },
  },
  darkMode: "class",
  plugins: [heroui({
    defaultTheme: "light",
    defaultExtendTheme: "light",
    themes: {
      light: {
        layout: {
          radius: {
            small: "0.25rem",
            medium: "0.5rem",
            large: "0.75rem",
          },
          borderWidth: {
            small: "1px",
            medium: "2px",
            large: "3px",
          },
          fontSize: {
            small: "0.875rem",
            medium: "1rem",
            large: "1.125rem",
          },
          disabledOpacity: 0.5,
          dividerWeight: "1px",
          boxShadow: {
            small: "0 2px 4px rgba(0,0,0,0.05)",
            medium: "0 4px 8px rgba(0,0,0,0.1)",
            large: "0 8px 16px rgba(0,0,0,0.15)",
          },
        },
        colors: {
          background: "#FAFBFC",
          foreground: "#1A202C",
          primary: {
            50: "#F2F9FF",
            100: "#E6F4FF",
            200: "#CCE9FF",
            300: "#99D1FF",
            400: "#66BAFF",
            500: "#3AA3FF",
            600: "#0088FF",
            700: "#006FD6",
            800: "#0055A8",
            900: "#003C7A",
            DEFAULT: "#3AA3FF",
            foreground: "#FFFFFF",
          },
          secondary: {
            50: "#FFF5F9",
            100: "#FFEAF3",
            200: "#FFD6E8",
            300: "#FFADD1",
            400: "#FF85BA",
            500: "#FF5CA3",
            600: "#FF338C",
            700: "#FF0A75",
            800: "#D6005F",
            900: "#A30049",
            DEFAULT: "#FF5CA3",
            foreground: "#FFFFFF",
          },
          focus: "#3AA3FF",
        },
      },
      dark: {
        // layout: {},
        colors: {},
      },
      // ... custom themes
    },
  })],
} satisfies Config;
