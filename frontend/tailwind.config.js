/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Titres hiérarchiques
        'display': ['"Metal Mania"', 'cursive'],              // H1 - Titres principaux
        'heading': ['"Rubik Distressed"', 'system-ui'],       // H2 - Sections
        'subheading': ['"Rubik Moonrocks"', 'system-ui'],     // H3 - Noms importants
        'accent': ['"Permanent Marker"', 'cursive'],          // Accents, citations
        // Textes & UI
        'body': ['"Patrick Hand"', 'cursive'],                // Corps de texte
        'button': ['"Architects Daughter"', 'cursive'],       // Boutons, navigation
        'alert': ['"Caveat Brush"', 'cursive'],               // Alertes, notifications
        'ui': ['"Indie Flower"', 'cursive'],                  // Labels, badges
      },
      fontSize: {
        // Échelle adaptée aux fonts handwritten
        'xs': ['0.75rem', { lineHeight: '1.5' }],
        'sm': ['0.875rem', { lineHeight: '1.5' }],
        'base': ['1rem', { lineHeight: '1.7' }],
        'lg': ['1.125rem', { lineHeight: '1.7' }],
        'xl': ['1.25rem', { lineHeight: '1.6' }],
        '2xl': ['1.5rem', { lineHeight: '1.5' }],
        '3xl': ['1.875rem', { lineHeight: '1.4' }],
        '4xl': ['2.25rem', { lineHeight: '1.3' }],
        '5xl': ['3rem', { lineHeight: '1.2' }],
        '6xl': ['3.75rem', { lineHeight: '1.1' }],
      },
      colors: {
        // Primaire - Terre et ruines
        primary: {
          50: '#f5f3f0',   // Brume claire
          100: '#e8e3dc',  // Pierre pâle
          200: '#d4c9ba',  // Sable ancien
          300: '#bba794',  // Terre sèche
          400: '#9d8570',  // Argile
          500: '#7a6454',  // Terre brûlée
          600: '#5e4d40',  // Bois vieilli
          700: '#453930',  // Écorce
          800: '#2f2722',  // Charbon
          900: '#1c1714',  // Suie profonde
          DEFAULT: '#7a6454',
        },
        // Secondaire - Feu sacré
        secondary: {
          50: '#fff8ed',   // Lueur douce
          100: '#ffecd1',  // Flamme pâle
          200: '#ffd5a3',  // Braise claire
          300: '#ffb86a',  // Ambre
          400: '#ff9635',  // Flamme vive
          500: '#e67315',  // Feu ardent
          600: '#c2580d',  // Braise intense
          700: '#944210',  // Cuivre oxydé
          800: '#6b3212',  // Rouille
          900: '#4a2410',  // Cendre chaude
          DEFAULT: '#e67315',
        },
        // Neutres - Structure
        neutral: {
          50: '#f8f9fa',   // Blanc cassé
          100: '#e9ecef',  // Brouillard léger
          200: '#d4d8dd',  // Pierre claire
          300: '#b8bfc7',  // Gris moyen
          400: '#8f99a5',  // Acier ancien
          500: '#64707e',  // Pierre de ruine
          600: '#4a5563',  // Ardoise
          700: '#343d48',  // Fer forgé
          800: '#232930',  // Ombre profonde
          900: '#151a1f',  // Nuit sans lune
        },
        // États
        success: {
          light: '#6b8e6f',   // Mousse ancienne
          DEFAULT: '#4a6f4d', // Feuillage survivant
          dark: '#2f4a31',    // Forêt dense
        },
        error: {
          light: '#c95951',   // Rouille sanglante
          DEFAULT: '#a63f38', // Sang séché
          dark: '#7a2e28',    // Danger mortel
        },
        warning: {
          light: '#d49858',   // Ocre clair
          DEFAULT: '#b8753e', // Terre cuite
          dark: '#8f5928',    // Cuir tanné
        },
        info: {
          light: '#6d8fa3',   // Ciel crépusculaire
          DEFAULT: '#4d6f82', // Eau stagnante
          dark: '#354f5e',    // Crépuscule profond
        },
        // Surfaces et fonds
        surface: {
          DEFAULT: '#ffffff',
          elevated: '#f5f3f0',
          dark: '#232930',
          'dark-elevated': '#343d48',
        },
        overlay: {
          light: 'rgba(28, 23, 20, 0.05)',
          medium: 'rgba(28, 23, 20, 0.15)',
          heavy: 'rgba(28, 23, 20, 0.60)',
          dark: 'rgba(21, 26, 31, 0.80)',
        },
      },
      textColor: {
        skin: {
          base: '#1c1714',      // Noir suie
          secondary: '#4a5563', // Gris ardoise
          muted: '#8f99a5',     // Gris acier
          inverse: '#f5f3f0',   // Brume claire
          accent: '#e67315',    // Feu ardent
        },
      },
      backgroundColor: {
        skin: {
          base: '#f8f9fa',         // Blanc cassé
          secondary: '#e9ecef',    // Brouillard léger
          tertiary: '#d4d8dd',     // Pierre claire
          dark: '#151a1f',         // Nuit sans lune
          'dark-secondary': '#232930',  // Ombre profonde
          'dark-tertiary': '#343d48',   // Fer forgé
        },
      },
      // Rayons de bordure - irréguliers et organiques
      borderRadius: {
        'none': '0',
        'sm': '0.125rem',      // 2px - Très subtil
        'DEFAULT': '0.25rem',  // 4px - Léger
        'md': '0.375rem',      // 6px - Modéré
        'lg': '0.5rem',        // 8px - Prononcé
        'xl': '0.75rem',       // 12px - Cards importantes
        '2xl': '1rem',         // 16px - Grandes surfaces
        'full': '9999px',      // Badges, pills
        // Variantes spéciales pour le thème
        'rough': '0.375rem',   // Équivalent à md, sémantique
        'stone': '0.5rem',     // Équivalent à lg, sémantique
      },
      // Ombres - atmosphère post-apocalyptique
      boxShadow: {
        // Ombres subtiles - éléments au repos
        'xs': '0 1px 2px 0 rgba(28, 23, 20, 0.08)',
        'sm': '0 1px 3px 0 rgba(28, 23, 20, 0.12), 0 1px 2px -1px rgba(28, 23, 20, 0.08)',
        'DEFAULT': '0 4px 6px -1px rgba(28, 23, 20, 0.12), 0 2px 4px -2px rgba(28, 23, 20, 0.08)',
        'md': '0 4px 6px -1px rgba(28, 23, 20, 0.12), 0 2px 4px -2px rgba(28, 23, 20, 0.08)',
        'lg': '0 10px 15px -3px rgba(28, 23, 20, 0.12), 0 4px 6px -4px rgba(28, 23, 20, 0.08)',
        'xl': '0 20px 25px -5px rgba(28, 23, 20, 0.12), 0 8px 10px -6px rgba(28, 23, 20, 0.08)',
        '2xl': '0 25px 50px -12px rgba(28, 23, 20, 0.25)',
        // Ombres spéciales thématiques
        'inner': 'inset 0 2px 4px 0 rgba(28, 23, 20, 0.1)',
        'inner-lg': 'inset 0 4px 8px 0 rgba(28, 23, 20, 0.15)',
        // Effets "glow" - feu sacré
        'glow-sm': '0 0 8px rgba(230, 115, 21, 0.3), 0 0 4px rgba(230, 115, 21, 0.2)',
        'glow': '0 0 16px rgba(230, 115, 21, 0.4), 0 0 8px rgba(230, 115, 21, 0.3)',
        'glow-lg': '0 0 24px rgba(230, 115, 21, 0.5), 0 0 12px rgba(230, 115, 21, 0.4)',
        // Ombres élevées - modals, dropdowns
        'elevated': '0 12px 24px -4px rgba(21, 26, 31, 0.2), 0 8px 16px -4px rgba(21, 26, 31, 0.12)',
        'elevated-lg': '0 20px 40px -8px rgba(21, 26, 31, 0.25), 0 12px 24px -8px rgba(21, 26, 31, 0.15)',
        // Ombres sombres - mode dark
        'dark-sm': '0 2px 8px 0 rgba(0, 0, 0, 0.3)',
        'dark': '0 4px 12px 0 rgba(0, 0, 0, 0.4)',
        'dark-lg': '0 8px 24px 0 rgba(0, 0, 0, 0.5)',
        'none': 'none',
      },
      // Durées de transition
      transitionDuration: {
        'fast': '150ms',
        'normal': '250ms',
        'slow': '400ms',
        'slower': '600ms',
      },
      // Fonctions d'accélération - organiques plutôt que mécaniques
      transitionTimingFunction: {
        'organic': 'cubic-bezier(0.33, 1, 0.68, 1)',      // Sortie douce, naturelle
        'draw': 'cubic-bezier(0.17, 0.67, 0.83, 0.67)',   // Animation de dessin
        'bounce-soft': 'cubic-bezier(0.34, 1.56, 0.64, 1)', // Rebond subtil
        'tribal': 'cubic-bezier(0.23, 1, 0.32, 1)',       // Mouvement tribal
      },
      // Z-index scale
      zIndex: {
        '0': '0',
        '10': '10',
        '20': '20',
        '30': '30',
        '40': '40',
        '50': '50',
        'dropdown': '1000',
        'sticky': '1020',
        'fixed': '1030',
        'modal-backdrop': '1040',
        'modal': '1050',
        'popover': '1060',
        'tooltip': '1070',
      },
      // Spacing custom - basé sur 4px
      spacing: {
        'px': '1px',
        '0': '0',
        '0.5': '0.125rem',  // 2px
        '1': '0.25rem',     // 4px
        '1.5': '0.375rem',  // 6px
        '2': '0.5rem',      // 8px
        '2.5': '0.625rem',  // 10px
        '3': '0.75rem',     // 12px
        '3.5': '0.875rem',  // 14px
        '4': '1rem',        // 16px
        '5': '1.25rem',     // 20px
        '6': '1.5rem',      // 24px
        '7': '1.75rem',     // 28px
        '8': '2rem',        // 32px
        '9': '2.25rem',     // 36px
        '10': '2.5rem',     // 40px
        '11': '2.75rem',    // 44px
        '12': '3rem',       // 48px
        '14': '3.5rem',     // 56px
        '16': '4rem',       // 64px
        '20': '5rem',       // 80px
        '24': '6rem',       // 96px
        '28': '7rem',       // 112px
        '32': '8rem',       // 128px
        '36': '9rem',       // 144px
        '40': '10rem',      // 160px
        '44': '11rem',      // 176px
        '48': '12rem',      // 192px
        '52': '13rem',      // 208px
        '56': '14rem',      // 224px
        '60': '15rem',      // 240px
        '64': '16rem',      // 256px
        '72': '18rem',      // 288px
        '80': '20rem',      // 320px
        '96': '24rem',      // 384px
      },
      // Opacité
      opacity: {
        '0': '0',
        '5': '0.05',
        '10': '0.1',
        '15': '0.15',
        '20': '0.2',
        '25': '0.25',
        '30': '0.3',
        '40': '0.4',
        '50': '0.5',
        '60': '0.6',
        '70': '0.7',
        '75': '0.75',
        '80': '0.8',
        '90': '0.9',
        '95': '0.95',
        '100': '1',
      },
    },
  },
  plugins: [],
}
