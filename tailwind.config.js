/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ITS Brand Guideline 2026 Official Palette
        its: {
          navy: '#192841',         // Biru Navy SIMT / Deep Space
          dark: '#0B132B',         // Deep Cybernetic Background
          cover: '#243F81',        // Biru Cover
          'blue-dark': '#233F7C',  // Biru Tua Logo ITS
          blue: '#127BBE',         // Biru Tua Lambang ITS (Primary)
          'blue-light': '#75BDE0', // Biru Muda Lambang ITS
          sky: '#26AEE4',          // Summer Sky FTK
          gold: '#FDBB16',         // Kuning Tua Logo / Emas Wijayakusuma
          fteic: '#FFD700',        // Gold FTEIC
          yellow: '#F6EC1D',       // Kuning Lambang
          silver: '#F3F4F6',       // Tugu Pahlawan Silver-White
          slate: '#1E2D4A',        // Card Background
          glass: 'rgba(25, 40, 65, 0.75)',
          'glass-border': 'rgba(117, 189, 224, 0.3)',
          // Status & faculties
          tosca: '#12B0A2',        // FKK Medical Tosca (Safe)
          brick: '#B31E23',        // FTIRS Fire Bricks (Alert/Penalty)
          crusta: '#F47D52',       // FV Crusta (Hot/Warn)
        },
        // Algorithm specific theme
        heft: '#127BBE',           // ITS Blue
        sfla: '#12B0A2',           // ITS Medical Tosca / Cyan
        base1: '#F47D52',          // ITS Crusta
        base2: '#7C3AED',          // Violet
      },
      fontFamily: {
        body: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'its-glow': '0 0 20px rgba(18, 123, 190, 0.35)',
        'its-gold-glow': '0 0 25px rgba(253, 187, 22, 0.45)',
        'its-card': '0 8px 32px 0 rgba(11, 19, 43, 0.37)',
      }
    },
  },
  plugins: [],
}
