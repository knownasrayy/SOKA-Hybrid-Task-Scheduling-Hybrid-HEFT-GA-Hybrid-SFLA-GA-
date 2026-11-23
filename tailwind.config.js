/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ITS Brand Guideline 2026 — Luminous Daylight Edition
        its: {
          navy: '#102344',         // Deep ITS Navy (Primary Ink / Text)
          dark: '#0B132B',         // Dark Accent
          darkNavy: '#192841',     // Alias for backward compatibility
          deepNavy: '#0F1E3A',     // Alias for backward compatibility
          cyber: '#EAF5FC',        // Bright Daylight Sky Canvas
          cover: '#243F81',        // Biru Cover ITS
          'blue-dark': '#1E3A73',  // Biru Tua Logo ITS
          blue: '#127BBE',         // Biru Lambang ITS (Primary)
          'blue-light': '#5EB4E0', // Biru Muda Lambang ITS
          sky: '#26AEE4',          // Summer Sky FTK
          gold: '#FDBB16',         // Kuning Emas Wijayakusuma
          fteic: '#FFD700',        // Gold FTEIC
          yellow: '#F6EC1D',       // Kuning Lambang
          silver: '#334E73',       // Readable Slate-Navy for body copy on light glass
          slate: '#F1F7FC',        // Soft Ice Card Background
          glass: 'rgba(255, 255, 255, 0.88)',
          'glass-border': 'rgba(18, 123, 190, 0.22)',
          // Status & faculties
          tosca: '#0D9488',        // FKK Medical Tosca (Safe / SFLA-GA)
          brick: '#DC2626',        // FTIRS Fire Bricks (Alert/Penalty)
          crusta: '#EA580C',       // FV Crusta (Hot/Warn)
        },
        // Algorithm specific theme
        heft: '#127BBE',           // ITS Blue
        sfla: '#0D9488',           // ITS Medical Tosca
        base1: '#EA580C',          // ITS Crusta
        base2: '#7C3AED',          // Violet
      },
      fontFamily: {
        body: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'its-glow': '0 4px 20px rgba(18, 123, 190, 0.18)',
        'its-gold': '0 4px 18px rgba(253, 187, 22, 0.35)',
        'its-gold-glow': '0 4px 20px rgba(253, 187, 22, 0.35)',
        'its-card': '0 12px 36px rgba(16, 35, 68, 0.12), 0 2px 8px rgba(18, 123, 190, 0.08)',
      }
    },
  },
  plugins: [],
}
