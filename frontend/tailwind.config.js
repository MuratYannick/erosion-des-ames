/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Couleurs pour le monde post-apocalyptique
        city: {
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

        // Couleurs pour les teintes Ocre (Sable, Terre, Rouille)
        ochre: {
          50: "#fffbeb", // Très clair, sable pâle
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d", // Jaune sable
          400: "#fbbf24",
          500: "#f97316", // Orange rouille
          600: "#ea580c",
          700: "#c2410c", // Ocre foncé/terre cuite
          800: "#9a3412",
          900: "#7c2d12", // Rouille profonde
          950: "#431405",
        },

        // Couleurs pour les teintes Verts Nature (Verdure, Forêt)
        nature: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efad",
          400: "#4ade80",
          500: "#22c55e", // Vert herbe
          600: "#16a34a",
          700: "#15803d", // Vert forêt
          800: "#14532d",
          900: "#052e16", // Vert très foncé/mousse
          950: "#021208",
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

        // Couleur rouge sang
        blood: {
          50: "#fef2f2",
          100: "#fee2e2",
          200: "#fecaca",
          300: "#fca5a5",
          400: "#f87171",
          500: "#ef4444",
          600: "#dc2626",
          700: "#991b1b", // Rouge sang principal
          800: "#7f1d1d",
          900: "#450a0a",
          950: "#1a0000",
        },
      },

      // --- CONFIGURATION DES GOOGLE FONTS ---
      fontFamily: {
        // Principales
        "titre-Jeu": ['"Metal Mania"', "cursive"],
        "texte-corps": ['"Permanent Marker"', "cursive"],

        // Secondaires
        "alternative-1": ["Bangers", "cursive"],
        "alternative-2": ["Creepster", "cursive"],

        // Polices de secours par défaut de Tailwind (optionnel, mais recommandé)
        sans: ["ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["ui-serif", "Georgia", "serif"],
        mono: ["ui-monospace", "SFMono-Regular", "monospace"],
      },
    },
  },
  plugins: [],
};
