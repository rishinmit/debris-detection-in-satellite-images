/**
 * DESIGN SYSTEM & THEME CONFIGURATION
 * Marine Debris Detection Dashboard
 * 
 * Futuristic Dark Scientific Dashboard
 * Color Scheme: Dark Navy + Cyan + Neon Accents
 */

// ============================================================================
// COLOR PALETTE
// ============================================================================

export const COLORS = {
  // Primary Accents
  cyan: '#8be9fd',
  green: '#50fa7b',
  orange: '#ffa502',
  red: '#ff4757',
  purple: '#5f27cd',
  blue: '#70a1ff',

  // Dark Backgrounds
  dark: {
    primary: '#0a0e1a',     // Deep navy (main background)
    secondary: '#141c34',   // Dark blue-gray (cards)
    tertiary: '#1e2a47',    // Lighter blue-gray (hover)
  },

  // Text Colors
  text: {
    primary: '#f8f8f2',     // Almost white
    secondary: 'rgba(248, 248, 242, 0.8)',
    tertiary: 'rgba(248, 248, 242, 0.6)',
    muted: 'rgba(248, 248, 242, 0.4)',
  },

  // Status Colors
  status: {
    success: '#50fa7b',
    warning: '#ffa502',
    danger: '#ff4757',
    info: '#8be9fd',
  },

  // Severity Levels
  severity: {
    critical: '#ff4757',
    high: '#ff6b6b',
    medium: '#ffa502',
    low: '#2ed573',
  },
};

// ============================================================================
// GLASSMORPHISM STYLES
// ============================================================================

export const GLASSMORPHISM = {
  light: {
    background: 'rgba(20, 28, 52, 0.5)',
    border: 'rgba(139, 233, 253, 0.15)',
    backdropFilter: 'blur(10px)',
  },
  medium: {
    background: 'rgba(20, 28, 52, 0.7)',
    border: 'rgba(139, 233, 253, 0.2)',
    backdropFilter: 'blur(15px)',
  },
  heavy: {
    background: 'rgba(20, 28, 52, 0.9)',
    border: 'rgba(139, 233, 253, 0.3)',
    backdropFilter: 'blur(20px)',
  },
};

// ============================================================================
// SHADOW SYSTEM
// ============================================================================

export const SHADOWS = {
  sm: '0 2px 8px rgba(0, 0, 0, 0.15)',
  md: '0 4px 16px rgba(0, 0, 0, 0.2)',
  lg: '0 8px 32px rgba(0, 0, 0, 0.3)',
  xl: '0 12px 48px rgba(0, 0, 0, 0.4)',
  
  // Glow effects
  glowCyan: '0 0 20px rgba(139, 233, 253, 0.3)',
  glowGreen: '0 0 20px rgba(80, 250, 123, 0.3)',
  glowRed: '0 0 20px rgba(255, 71, 87, 0.3)',
  
  // Inset
  inset: 'inset 0 1px 1px rgba(139, 233, 253, 0.1)',
};

// ============================================================================
// GRADIENT PRESETS
// ============================================================================

export const GRADIENTS = {
  // Primary gradient (cyan to green)
  primary: 'linear-gradient(135deg, #8be9fd 0%, #50fa7b 100%)',

  // Card background
  card: 'linear-gradient(135deg, rgba(20, 28, 52, 0.9) 0%, rgba(30, 42, 71, 0.85) 100%)',

  // Ensemble card
  ensemble: 'linear-gradient(135deg, rgba(80, 250, 123, 0.08) 0%, rgba(139, 233, 253, 0.08) 100%)',

  // Danger (red)
  danger: 'linear-gradient(135deg, rgba(255, 71, 87, 0.1) 0%, rgba(255, 71, 87, 0.05) 100%)',

  // Success (green)
  success: 'linear-gradient(135deg, rgba(80, 250, 123, 0.1) 0%, rgba(80, 250, 123, 0.05) 100%)',

  // Background blur effect
  backdrop: 'radial-gradient(circle at 20% 30%, rgba(139, 233, 253, 0.03) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(80, 250, 123, 0.03) 0%, transparent 50%)',
};

// ============================================================================
// TYPOGRAPHY
// ============================================================================

export const TYPOGRAPHY = {
  font: {
    heading: "'Outfit', sans-serif",
    body: "'Outfit', sans-serif",
    mono: "'JetBrains Mono', monospace",
  },

  size: {
    xs: '0.75rem',      // 12px
    sm: '0.875rem',     // 14px
    base: '1rem',       // 16px
    lg: '1.125rem',     // 18px
    xl: '1.25rem',      // 20px
    '2xl': '1.5rem',    // 24px
    '3xl': '1.875rem',  // 30px
    '4xl': '2.25rem',   // 36px
  },

  weight: {
    thin: 100,
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  },

  lineHeight: {
    tight: 1.2,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },
};

// ============================================================================
// SPACING SCALE
// ============================================================================

export const SPACING = {
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  '2xl': '3rem',   // 48px
  '3xl': '4rem',   // 64px
};

// ============================================================================
// BORDER RADIUS
// ============================================================================

export const BORDER_RADIUS = {
  none: '0',
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  '2xl': '18px',
  '3xl': '24px',
  full: '9999px',
};

// ============================================================================
// BREAKPOINTS (Responsive)
// ============================================================================

export const BREAKPOINTS = {
  xs: '0px',
  sm: '480px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

// ============================================================================
// Z-INDEX HIERARCHY
// ============================================================================

export const Z_INDEX = {
  hide: -1,
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modal: 1040,
  popover: 1050,
  tooltip: 1060,
};

// ============================================================================
// ANIMATION TIMING
// ============================================================================

export const ANIMATION = {
  duration: {
    instant: '50ms',
    fast: '100ms',
    normal: '200ms',
    slow: '300ms',
    slower: '500ms',
    slowest: '1000ms',
  },

  easing: {
    linear: 'linear',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeQuad: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    easeCubic: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
  },
};

// ============================================================================
// COMPONENT DEFAULTS
// ============================================================================

export const COMPONENT_DEFAULTS = {
  card: {
    padding: '1.5rem',
    borderRadius: '12px',
    border: '1px solid rgba(139, 233, 253, 0.2)',
    background: 'linear-gradient(135deg, rgba(20, 28, 52, 0.8) 0%, rgba(30, 42, 71, 0.75) 100%)',
  },

  button: {
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    fontSize: '0.95rem',
    fontWeight: 600,
    transition: 'all 0.3s ease',
  },

  input: {
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    fontSize: '0.95rem',
    background: 'rgba(10, 14, 26, 0.8)',
    border: '1px solid rgba(139, 233, 253, 0.2)',
    color: '#f8f8f2',
  },
};

// ============================================================================
// CLASS COLORS (For classification badges)
// ============================================================================

export const CLASS_COLORS = {
  marine_debris: {
    color: '#ff4757',
    background: 'rgba(255, 71, 87, 0.1)',
    border: 'rgba(255, 71, 87, 0.3)',
  },
  sargassum: {
    color: '#2ed573',
    background: 'rgba(46, 213, 115, 0.1)',
    border: 'rgba(46, 213, 115, 0.3)',
  },
  turbid_water: {
    color: '#ffa502',
    background: 'rgba(255, 165, 2, 0.1)',
    border: 'rgba(255, 165, 2, 0.3)',
  },
  organic: {
    color: '#5f27cd',
    background: 'rgba(95, 39, 205, 0.1)',
    border: 'rgba(95, 39, 205, 0.3)',
  },
  cloud: {
    color: '#70a1ff',
    background: 'rgba(112, 161, 255, 0.1)',
    border: 'rgba(112, 161, 255, 0.3)',
  },
};

// ============================================================================
// UTILITY STYLES (CSS-in-JS ready)
// ============================================================================

export const UTILITIES = {
  flexCenter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  flexBetween: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  flexColumn: {
    display: 'flex',
    flexDirection: 'column',
  },

  absoluteCenter: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },

  truncate: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },

  hideScrollbar: {
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
};

// ============================================================================
// RESPONSIVE HELPERS
// ============================================================================

export const MEDIA = {
  xs: '@media (min-width: 0px)',
  sm: '@media (min-width: 480px)',
  md: '@media (min-width: 768px)',
  lg: '@media (min-width: 1024px)',
  xl: '@media (min-width: 1280px)',
  '2xl': '@media (min-width: 1536px)',

  // Mobile-first helpers
  notSm: '@media (min-width: 480px)',
  notMd: '@media (min-width: 768px)',
  notLg: '@media (min-width: 1024px)',

  // Max-width helpers
  maxSm: '@media (max-width: 479px)',
  maxMd: '@media (max-width: 767px)',
  maxLg: '@media (max-width: 1023px)',
  maxXl: '@media (max-width: 1279px)',
};

// ============================================================================
// EXPORT DEFAULT THEME
// ============================================================================

export default {
  colors: COLORS,
  glassmorphism: GLASSMORPHISM,
  shadows: SHADOWS,
  gradients: GRADIENTS,
  typography: TYPOGRAPHY,
  spacing: SPACING,
  borderRadius: BORDER_RADIUS,
  breakpoints: BREAKPOINTS,
  zIndex: Z_INDEX,
  animation: ANIMATION,
  componentDefaults: COMPONENT_DEFAULTS,
  classColors: CLASS_COLORS,
  utilities: UTILITIES,
  media: MEDIA,
};
