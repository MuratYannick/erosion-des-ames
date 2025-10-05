/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Couleurs pour le monde post-apocalyptique
        wasteland: {
          50: "#f8f9fa",
          100: "#e9ecef",
          200: "#dee2e6",
          300: "#ced4da",
          400: "#adb5bd",
          500: "#6c757d",
          600: "#495057",
          700: "#343a40",
          800: "#212529",
          900: "#0d1117",
          950: "#010409",
        },
        // Couleurs pour la faction Mutante (Les Éveillés)
        mutant: {
          light: "#4ade80",
          DEFAULT: "#22c55e",
          dark: "#16a34a",
        },
        // Couleurs pour la faction Pure (Les Purs)
        pure: {
          light: "#60a5fa",
          DEFAULT: "#3b82f6",
          dark: "#2563eb",
        },
        // Couleurs neutres
        neutral: {
          light: "#a8a29e",
          DEFAULT: "#78716c",
          dark: "#57534e",
        },
      },
    },
  },
  plugins: [],
};
