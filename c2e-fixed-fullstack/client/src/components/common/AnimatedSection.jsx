import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { fadeUp } from '../../utils/animationVariants'

function AnimatedSection({ children, className = '', delay = 0 }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.15 })

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={fadeUp}
      custom={delay}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function AnimatedStagger({ children, className = '', stagger = 0.08 }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: stagger,
            delayChildren: 0.15,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function AnimatedItem({ children, index = 0, className = '' }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 24 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1],
            delay: index * 0.06,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export { AnimatedSection, AnimatedStagger, AnimatedItem }

