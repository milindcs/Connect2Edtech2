import { motion } from 'framer-motion'
import { Target, Eye, HeartHandshake } from 'lucide-react'
import {
  missionHeadingReveal,
  missionCardLeft,
  missionCardCenter,
  missionCardRight,
  missionIconPop,
  missionTextSlide,
  missionStaggerContainer,
} from '../../utils/animationVariants'
import SectionHeading from '../common/SectionHeading.jsx'

const CARDS = [
  {
    icon: Target,
    title: 'Our Mission',
    text: 'To equip every learner with practical, industry-relevant skills and mentorship so they can confidently step into a career — not just complete a course.',
    accent: 'bg-accent',
    variant: missionCardLeft,
  },
  {
    icon: Eye,
    title: 'Our Vision',
    text: 'To become the most trusted bridge between education and employment, where learning is always connected to real opportunity.',
    accent: 'bg-pink',
    variant: missionCardCenter,
  },
  {
    icon: HeartHandshake,
    title: 'Our Values',
    text: 'Rooted in integrity, accessibility, and real-world impact — we build learning experiences that turn ambition into opportunity for every learner.',
    accent: 'bg-accent',
    variant: missionCardRight,
  },
]

function MissionVisionSection() {
  return (
      <motion.section
        className="w-full px-4 sm:px-6 md:px-8 py-10 sm:py-14 md:py-18 lg:py-24"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.12,
              delayChildren: 0.1,
            },
          },
        }}
      >
      <motion.div variants={missionHeadingReveal} className="flex flex-col">
        <SectionHeading title="Mission, Vision &amp; Values" align="left" className="mb-8 sm:mb-10 md:mb-12" />
      </motion.div>
      <motion.div
        variants={missionStaggerContainer}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-8 max-w-7xl mx-auto"
      >
        {CARDS.map((card, i) => (
          <motion.div
            key={card.title}
            variants={card.variant}
            custom={i}
            className="glass-card rounded-[1.5rem] sm:rounded-[1.75rem] p-5 sm:p-6 md:p-7 lg:p-9 flex flex-col gap-4 sm:gap-5"
          >
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: { opacity: 0, scale: 0.85 },
                visible: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 260, damping: 20, mass: 0.8 } },
              }}
              className={`pointer-events-none absolute -top-8 -right-8 w-32 h-32 sm:w-40 sm:h-40 rounded-full ${card.accent} opacity-10 blur-2xl`}
            />

            <motion.span
              variants={missionIconPop}
              className="glass-icon-glow relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center flex-shrink-0"
            >
              <card.icon className="w-5 h-5 sm:w-6 sm:h-6 text-pink" strokeWidth={1.8} />
            </motion.span>

            <motion.h3 variants={missionTextSlide} className="relative text-black text-base sm:text-lg md:text-xl font-semibold">{card.title}</motion.h3>

            <motion.p variants={missionTextSlide} className="relative text-slate-500 text-sm leading-relaxed font-medium">{card.text}</motion.p>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  )
}

export default MissionVisionSection
