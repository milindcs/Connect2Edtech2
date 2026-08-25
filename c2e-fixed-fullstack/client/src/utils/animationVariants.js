// Shared Framer Motion variants used across the hero section.

export const EASE = [0.22, 1, 0.36, 1]

// Check for reduced motion preference
const prefersReducedMotion = typeof window !== 'undefined'
  ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
  : false

const reduced = (dur) => (prefersReducedMotion ? 0.001 : dur)
const delay = (ms) => (prefersReducedMotion ? 0 : ms)

// =====================================================================
// CORE VARIANTS
// =====================================================================

export const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (custom = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: delay(custom * 0.12),
      duration: reduced(0.6),
      ease: EASE,
    },
  }),
}

export const mentorCardReveal = {
  hidden: { opacity: 0, y: 30 },
  visible: (custom = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: delay(custom * 0.12),
      duration: reduced(0.6),
      ease: EASE,
    },
  }),
}

export const fadeDown = {
  hidden: { opacity: 0, y: -20 },
  visible: (custom = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: delay(custom * 0.1),
      duration: reduced(0.5),
      ease: EASE,
    },
  }),
}

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: (custom = 0) => ({
    opacity: 1,
    transition: {
      delay: delay(custom * 0.1),
      duration: reduced(0.5),
      ease: EASE,
    },
  }),
}

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: (custom = 0) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: delay(custom * 0.12),
      duration: reduced(0.65),
      ease: EASE,
    },
  }),
}

export const slideInLeft = {
  hidden: { opacity: 0, x: -45 },
  visible: (custom = 0) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: delay(custom * 0.1),
      duration: reduced(0.55),
      ease: EASE,
    },
  }),
}

export const slideInRight = {
  hidden: { opacity: 0, x: 45 },
  visible: (custom = 0) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: delay(custom * 0.1),
      duration: reduced(0.55),
      ease: EASE,
    },
  }),
}

export const slideInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: (custom = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: delay(custom * 0.12),
      duration: reduced(0.7),
      ease: EASE,
    },
  }),
}

export const rotateIn = {
  hidden: { opacity: 0, rotate: -5, scale: 0.97 },
  visible: (custom = 0) => ({
    opacity: 1,
    rotate: 0,
    scale: 1,
    transition: {
      delay: delay(custom * 0.12),
      duration: reduced(0.65),
      ease: EASE,
    },
  }),
}

export const iconPop = {
  hidden: { opacity: 0, scale: 0.4, rotate: -15 },
  visible: (custom = 0) => ({
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: {
      delay: delay(custom * 0.08),
      duration: reduced(0.5),
      ease: [0.34, 1.56, 0.64, 1],
    },
  }),
}

// =====================================================================
// STAGGER CONTAINERS
// =====================================================================

export const staggerFadeUp = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: delay(0.1),
    },
  },
}

export const staggerScale = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: delay(0.1),
    },
  },
}

// =====================================================================
// ABOUT PAGE SECTION VARIANTS
// =====================================================================

export const aboutNavReveal = {
  hidden: { opacity: 0, y: -15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: reduced(0.55), ease: EASE },
  },
}

export const aboutBackReveal = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: reduced(0.5), ease: EASE },
  },
}

export const aboutStatsReveal = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: reduced(0.7), ease: EASE },
  },
}

export const aboutStoryReveal = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: reduced(0.7), ease: EASE },
  },
}

export const aboutMissionReveal = {
  hidden: { opacity: 0, rotate: -2, scale: 0.98 },
  visible: {
    opacity: 1,
    rotate: 0,
    scale: 1,
    transition: { duration: reduced(0.7), ease: EASE },
  },
}

export const aboutWhyReveal = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: reduced(0.7), ease: EASE },
  },
}

export const aboutFooterReveal = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: reduced(0.6), ease: EASE },
  },
}

// =====================================================================
// OUR STORY CARD VARIANTS
// =====================================================================

export const storyCardStagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.18,
      delayChildren: delay(0.15),
    },
  },
}

export const storyCardItem = {
  hidden: { opacity: 0, y: 35, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: reduced(0.7), ease: EASE },
  },
}

export const storyIconItem = {
  hidden: { opacity: 0, scale: 0.6 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: reduced(0.5), ease: [0.34, 1.56, 0.64, 1] },
  },
}

export const storyTextItem = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: reduced(0.55), ease: EASE },
  },
}

// =====================================================================
// MISSION / VISION / VALUES VARIANTS
// =====================================================================

export const missionHeadingReveal = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: reduced(0.7), ease: EASE },
  },
}

export const missionCardLeft = {
  hidden: { opacity: 0, x: -45, y: 25 },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: { duration: reduced(0.75), ease: EASE },
  },
}

export const missionCardCenter = {
  hidden: { opacity: 0, scale: 0.9, y: 30 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: reduced(0.7), ease: EASE },
  },
}

export const missionCardRight = {
  hidden: { opacity: 0, x: 45, y: 25 },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: { duration: reduced(0.75), ease: EASE },
  },
}

export const missionIconPop = {
  hidden: { opacity: 0, scale: 0.5, rotate: -18 },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: { duration: reduced(0.55), ease: [0.34, 1.56, 0.64, 1] },
  },
}

export const missionTextSlide = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: reduced(0.55), ease: EASE },
  },
}

export const missionStaggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.18,
      delayChildren: delay(0.12),
    },
  },
}

// =====================================================================
// WHY CHOOSE SECTION VARIANTS
// =====================================================================

export const whyCardStagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: delay(0.1),
    },
  },
}

export const whyCardItem = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: reduced(0.6), ease: EASE },
  },
}

export const whyIconPop = {
  hidden: { opacity: 0, scale: 0.5, rotate: -12 },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: { duration: reduced(0.45), ease: [0.34, 1.56, 0.64, 1] },
  },
}

export const whyTextSlide = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: reduced(0.5), ease: EASE },
  },
}

// =====================================================================
// HERO SECTION VARIANTS
// =====================================================================

export const headingSlideUp = {
  hidden: { y: '110%' },
  visible: (wordIndex = 0) => ({
    y: 0,
    transition: {
      delay: delay(0.4 + wordIndex * 0.14),
      duration: reduced(0.7),
      ease: EASE,
    },
  }),
}

// =====================================================================
// GLASS CARD ANIMATIONS (Floating Glass + Morphing Blobs)
// =====================================================================

export const glassHeadingReveal = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 260,
      damping: 20,
      mass: 0.8,
    },
  },
}

export const glassCardReveal = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 18,
      mass: 1,
    },
  },
}

export const glassIconPop = {
  hidden: { opacity: 0, scale: 0.3, rotate: -20 },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 12,
      mass: 0.5,
    },
  },
}

export const glassTextReveal = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 20,
      mass: 0.8,
    },
  },
}

export const glassStagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
}

export const glassFloat = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 150,
      damping: 14,
      mass: 1,
    },
  },
}

export const glassFadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 20,
      mass: 1,
    },
  },
}

// Hover scale effect for About page cards.
export const cardHover = {
  hover: {
    scale: 1.03,
    transition: { duration: 0.3, ease: EASE },
  },
}

// =====================================================================
// BECOME-A-TRAINER FORM — PREMIUM SPRING ENTRANCES
// Distinct, spring-physics driven set (different feel from the standard
// tween variants). All respect prefers-reduced-motion.
// =====================================================================

const trainerSpring = { type: 'spring', stiffness: 110, damping: 18, mass: 0.8 }

export const heroSpring = {
  hidden: { opacity: 0, y: 36, scale: 0.98 },
  visible: prefersReducedMotion
    ? { opacity: 1, y: 0, scale: 1, transition: { duration: 0.001 } }
    : { opacity: 1, y: 0, scale: 1, transition: trainerSpring },
}

export const cardRiseLeft = {
  hidden: { opacity: 0, x: -64 },
  visible: prefersReducedMotion
    ? { opacity: 1, x: 0, transition: { duration: 0.001 } }
    : { opacity: 1, x: 0, transition: trainerSpring },
}

export const cardRiseRight = {
  hidden: { opacity: 0, x: 64 },
  visible: prefersReducedMotion
    ? { opacity: 1, x: 0, transition: { duration: 0.001 } }
    : { opacity: 1, x: 0, transition: trainerSpring },
}

export const cardPop = {
  hidden: { opacity: 0, scale: 0.82 },
  visible: prefersReducedMotion
    ? { opacity: 1, scale: 1, transition: { duration: 0.001 } }
    : { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 260, damping: 20, mass: 0.7 } },
}

export const cardFlipUp = {
  hidden: { opacity: 0, y: 40, rotateX: -12 },
  visible: prefersReducedMotion
    ? { opacity: 1, y: 0, rotateX: 0, transition: { duration: 0.001 } }
    : { opacity: 1, y: 0, rotateX: 0, transition: { duration: 0.6, ease: EASE } },
}

export const cardDrop = {
  hidden: { opacity: 0, y: -40 },
  visible: prefersReducedMotion
    ? { opacity: 1, y: 0, transition: { duration: 0.001 } }
    : { opacity: 1, y: 0, transition: trainerSpring },
}

export const cardFade = {
  hidden: { opacity: 0 },
  visible: prefersReducedMotion
    ? { opacity: 1, transition: { duration: 0.001 } }
    : { opacity: 1, transition: { duration: 0.6, ease: EASE } },
}

export const cardZoom = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: prefersReducedMotion
    ? { opacity: 1, scale: 1, transition: { duration: 0.001 } }
    : { opacity: 1, scale: 1, transition: { duration: 0.55, ease: EASE } },
}

// =====================================================================
// BECOME-A-TRAINER FORM — CLIP-PATH WIPE REVEALS (alt style)
// Cards wipe into view via animated clip-path (distinct from the spring
// and standard tween sets). Respects prefers-reduced-motion.
// =====================================================================

const wipeReveal = (fromClip) => ({
  hidden: { opacity: 0, y: 24, clipPath: fromClip },
  visible: prefersReducedMotion
    ? { opacity: 1, y: 0, clipPath: 'inset(0 0 0 0)', transition: { duration: 0.001 } }
    : { opacity: 1, y: 0, clipPath: 'inset(0 0 0 0)', transition: { duration: 0.7, ease: EASE } },
})

export const cardWipeUp = wipeReveal('inset(0 0 100% 0)')
export const cardWipeLeft = wipeReveal('inset(0 100% 0 0)')
export const cardWipeRight = wipeReveal('inset(0 0 0 100%)')
export const cardWipeScale = {
  hidden: { opacity: 0, scale: 0.96, clipPath: 'inset(0 0 100% 0)' },
  visible: prefersReducedMotion
    ? { opacity: 1, scale: 1, clipPath: 'inset(0 0 0 0)', transition: { duration: 0.001 } }
    : { opacity: 1, scale: 1, clipPath: 'inset(0 0 0 0)', transition: { duration: 0.65, ease: EASE } },
}

// Per-field micro reveal (used inside cards, staggered after the card wipes in)
export const fieldItem = {
  hidden: { opacity: 0, y: 12 },
  visible: prefersReducedMotion
    ? { opacity: 1, y: 0, transition: { duration: 0.001 } }
    : { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
}

// Card-level wrappers that combine a clip-path wipe with a staggered reveal
// of their inner fields.
const staggerWrap = (hidden, visible, transition) => ({
  hidden: { opacity: 0, ...hidden },
  visible: prefersReducedMotion
    ? { opacity: 1, ...visible, transition: { duration: 0.001 } }
    : {
        opacity: 1,
        ...visible,
        transition: { ...transition, staggerChildren: 0.07, delayChildren: 0.12 },
      },
})

export const cardWipeStaggerUp = staggerWrap(
  { y: 24, clipPath: 'inset(0 0 100% 0)' },
  { y: 0, clipPath: 'inset(0 0 0 0)' },
  { duration: 0.7, ease: EASE }
)
export const cardWipeStaggerLeft = staggerWrap(
  { y: 24, clipPath: 'inset(0 100% 0 0)' },
  { y: 0, clipPath: 'inset(0 0 0 0)' },
  { duration: 0.7, ease: EASE }
)
export const cardWipeStaggerRight = staggerWrap(
  { y: 24, clipPath: 'inset(0 0 0 100%)' },
  { y: 0, clipPath: 'inset(0 0 0 0)' },
  { duration: 0.7, ease: EASE }
)
export const cardWipeStaggerScale = staggerWrap(
  { scale: 0.96, clipPath: 'inset(0 0 100% 0)' },
  { scale: 1, clipPath: 'inset(0 0 0 0)' },
  { duration: 0.65, ease: EASE }
)
export const cardZoomStagger = staggerWrap(
  { scale: 0.92 },
  { scale: 1 },
  { duration: 0.6, ease: EASE }
)
