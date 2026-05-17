/**
 * Framer Motion animation presets and utilities
 * Reusable animation configurations for consistent motion design
 */

// ============================================================================
// FADE ANIMATIONS
// ============================================================================

export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
  transition: { duration: 0.5, ease: "easeOut" }
};

export const fadeInDown = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.5, ease: "easeOut" }
};

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.4, ease: "easeOut" }
};

export const fadeInScale = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
  transition: { duration: 0.4, ease: "easeOut" }
};

// ============================================================================
// SLIDE ANIMATIONS
// ============================================================================

export const slideInLeft = {
  initial: { opacity: 0, x: -40 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
  transition: { duration: 0.5, ease: "easeOut" }
};

export const slideInRight = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 40 },
  transition: { duration: 0.5, ease: "easeOut" }
};

// ============================================================================
// STAGGER CONTAINER FOR CHILD ITEMS
// ============================================================================

export const staggerContainer = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
  exit: { opacity: 0 },
};

export const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
  transition: { duration: 0.4 }
};

// ============================================================================
// GLOW & PULSE ANIMATIONS
// ============================================================================

export const pulseGlow = {
  animate: {
    boxShadow: [
      "0 0 20px rgba(139, 233, 253, 0.3)",
      "0 0 40px rgba(139, 233, 253, 0.6)",
      "0 0 20px rgba(139, 233, 253, 0.3)"
    ],
  },
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: "easeInOut"
  }
};

export const neonGlow = {
  animate: {
    textShadow: [
      "0 0 10px rgba(139, 233, 253, 0.5)",
      "0 0 20px rgba(139, 233, 253, 0.8)",
      "0 0 10px rgba(139, 233, 253, 0.5)"
    ],
  },
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut"
  }
};

// ============================================================================
// HOVER EFFECTS
// ============================================================================

export const hoverLift = {
  whileHover: { y: -5, transition: { duration: 0.3 } },
  whileTap: { y: 0 }
};

export const hoverScale = {
  whileHover: { scale: 1.05, transition: { duration: 0.3 } },
  whileTap: { scale: 0.98 }
};

export const hoverGlow = {
  whileHover: {
    boxShadow: "0 0 30px rgba(139, 233, 253, 0.8)",
    transition: { duration: 0.3 }
  }
};

// ============================================================================
// PROGRESS & LOADING ANIMATIONS
// ============================================================================

export const progressBar = {
  initial: { width: 0 },
  animate: { width: "100%" },
  transition: { duration: 2, ease: "easeInOut" }
};

export const shimmer = {
  animate: {
    backgroundPosition: ["200% center", "-200% center"]
  },
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: "linear"
  }
};

export const spin = {
  animate: { rotate: 360 },
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: "linear"
  }
};

// ============================================================================
// CARD ANIMATIONS
// ============================================================================

export const cardHover = {
  whileHover: {
    y: -8,
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
    transition: { duration: 0.3 }
  },
  whileTap: { scale: 0.98 }
};

export const cardTap = {
  whileTap: { scale: 0.95 },
  transition: { duration: 0.2 }
};

// ============================================================================
// BAR ANIMATIONS (for confidence bars, progress, etc)
// ============================================================================

export const barFillAnimation = {
  initial: { width: 0, opacity: 0 },
  animate: { 
    width: "var(--bar-width, 100%)",
    opacity: 1
  },
  transition: { 
    duration: 1, 
    ease: "easeOut",
    type: "spring",
    stiffness: 100,
    damping: 30
  }
};

// ============================================================================
// BACKDROP ANIMATIONS
// ============================================================================

export const backdropFade = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.3 }
};

// ============================================================================
// COMPLEX SEQUENCES
// ============================================================================

export const imageLoadSequence = {
  container: {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      }
    }
  },
  item: {
    hidden: { opacity: 0, scale: 0.9 },
    show: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  }
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Create a custom stagger animation
 */
export function createStaggerAnimation(delay = 0.1, duration = 0.4) {
  return {
    container: {
      initial: { opacity: 0 },
      animate: {
        opacity: 1,
        transition: {
          staggerChildren: delay,
        }
      }
    },
    item: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration }
    }
  };
}

/**
 * Create bounce animation
 */
export const bounce = {
  animate: {
    y: [0, -10, 0],
  },
  transition: {
    duration: 0.6,
    repeat: Infinity,
    ease: "easeInOut"
  }
};

/**
 * Rotate animation
 */
export function createRotateAnimation(duration = 3) {
  return {
    animate: { rotate: 360 },
    transition: {
      duration,
      repeat: Infinity,
      ease: "linear"
    }
  };
}
