/**
 * 3D Color Palette adhering strictly to ITS Brand Guidelines 2026
 */
export const PALETTE_3D = {
  // ITS Brand 2026 Official Colors (Hex numbers for Three.js)
  itsNavy: 0x192841,        // Biru Navy SIMT
  itsDark: 0x0b132b,        // Cybernetic background
  itsBlueCover: 0x243f81,   // Biru Cover
  itsBlueDark: 0x233f7c,    // Biru Tua Logo
  itsBlue: 0x127bbe,        // Biru Tua Lambang (Primary ITS Blue)
  itsBlueLight: 0x75bde0,   // Biru Muda Lambang
  itsSky: 0x26aee4,         // Summer Sky FTK
  itsGold: 0xfdbb16,        // Kuning Emas Wijayakusuma
  itsFteicGold: 0xffd700,   // FTEIC Gold (Dept TI)
  itsYellow: 0xf6ec1d,      // Kuning Lambang
  itsSilver: 0xf3f4f6,      // Tugu Pahlawan Silver-White
  itsTosca: 0x12b0a2,       // FKK Medical Tosca (Safe)
  itsBrick: 0xb31e23,       // FTIRS Fire Bricks (Alert)
  itsCrusta: 0xf47d52,      // FV Crusta (Warn)

  // Algorithm Solvers
  heft: 0x127bbe,           // ITS Blue
  sfla: 0x12b0a2,           // ITS Cyan/Tosca
  baseline1: 0xf47d52,      // ITS Crusta
  baseline2: 0x7c3aed,      // Violet
  ga: 0x4a5568,             // Neutral Slate

  // Status & Highlights
  activeHighlight: 0xfdbb16, // Golden yellow
  doneSafe: 0x12b0a2,
  idleGray: 0x4a5568,

  // VM Tiers in 3D
  vmTiers: [
    0x127bbe, // VM-1 Micro (ITS Blue)
    0x26aee4, // VM-2 Standard (Summer Sky)
    0x12b0a2, // VM-3 High-Compute (Medical Tosca)
    0x75bde0  // VM-4 Ultra-Fast (ITS Light Blue)
  ]
};
