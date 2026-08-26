import { motion } from 'framer-motion'
import { Sparkles, Rocket, HeartHandshake } from 'lucide-react'
import {
  glassStagger,
  glassCardReveal,
  glassIconPop,
  glassTextReveal,
} from '../../utils/animationVariants'
import SectionHeading from '../common/SectionHeading.jsx'
import SectionShell from '../common/SectionShell.jsx'

const STORY_POINTS = [
  {
    icon: Sparkles,
    title: 'Where It Started',
    text: 'Connect2Edtech began with a simple idea: learning should lead somewhere. We set out to close the gap between classroom knowledge and what the industry actually needs.',
    stat: '2024',
    statLabel: 'Founded',
  },
  {
    icon: Rocket,
    title: 'What We Built',
    text: 'From that idea grew a platform combining structured courses, live projects, and mentorship from working professionals — designed to make learners job-ready, not just certificate-ready.',
    stat: '60+',
    statLabel: 'Courses',
  },
  {
    icon: HeartHandshake,
    title: 'Where We Are Now',
    text: 'Today, Connect2Edtech supports learners across technical and non-technical tracks, connecting them with mentors, hiring partners, and a community invested in their growth.',
    stat: '13K+',
    statLabel: 'Students',
  },
]

function OurStorySection() {
  return (
    <SectionShell tone="grey">
      <section className="w-full">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: { opacity: 0, y: 25 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { type: 'spring', stiffness: 260, damping: 20, mass: 0.8 },
            },
          }}
          className="mb-8 sm:mb-10 md:mb-12"
        >
          <SectionHeading
            title="Our Story"
            subtitle="A quick look at how Connect2Edtech came to be — and where we're headed next."
          />
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={glassStagger}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-8 max-w-7xl mx-auto"
        >
          {STORY_POINTS.map((point, i) => (
            <motion.div
              key={point.title}
              variants={glassCardReveal}
              custom={i}
              className="glass-card rounded-[1.5rem] sm:rounded-[1.75rem] p-5 sm:p-6 md:p-7 flex flex-col gap-3 sm:gap-4"
            >
              <div className="flex items-center justify-between">
                <motion.span
                  variants={glassIconPop}
                  className="glass-icon-glow w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center flex-shrink-0"
                >
                  <point.icon className="w-4 h-4 sm:w-5 sm:h-5 text-pink" strokeWidth={1.8} />
                </motion.span>
                <motion.div variants={glassTextReveal} className="text-right">
                  <p className="text-base sm:text-lg font-bold text-accent">{point.stat}</p>
                  <p className="text-[9px] sm:text-[10px] uppercase tracking-wider text-slate-500 font-medium">{point.statLabel}</p>
                </motion.div>
              </div>
              <motion.h3 variants={glassTextReveal} className="text-black text-sm sm:text-base md:text-lg font-semibold">{point.title}</motion.h3>
              <motion.p variants={glassTextReveal} className="text-slate-500 text-xs sm:text-sm leading-relaxed font-medium">{point.text}</motion.p>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </SectionShell>
  )
}

export default OurStorySection
