import { Search, Handshake, BookOpen, BadgeCheck, Briefcase } from 'lucide-react'
import { motion } from 'framer-motion'
import SectionHeading from '../common/SectionHeading.jsx'
import ProcessCard from './cards/ProcessCard.jsx'
import { fadeUp } from '../../utils/animationVariants'

const STEPS = [
  {
    step: '01',
    icon: Search,
    title: 'Discover Us',
    description: 'Colleges reach out to us for collaboration.',
  },
  {
    step: '02',
    icon: Handshake,
    title: 'Collaborate',
    description: 'We partner and work together closely.',
  },
  {
    step: '03',
    icon: BookOpen,
    title: 'Learn',
    description: 'We teach theory, practicals & industry skills.',
  },
  {
    step: '04',
    icon: BadgeCheck,
    title: 'Get Certified',
    description: 'Students receive their certification.',
  },
  {
    step: '05',
    icon: Briefcase,
    title: 'Get Hired',
    description: 'We help them become career-ready.',
  },
]

function HowWeWorkSection() {
  return (
      <motion.section
        className="w-full px-4 sm:px-6 md:px-8 py-14 sm:py-18 md:py-24 lg:py-28"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1,
              delayChildren: 0.1,
            },
          },
        }}
      >
      <motion.div variants={fadeUp} className="flex flex-col">
        <SectionHeading
          title="HOW WE WORK"
          subtitle="Our 5-step learning journey is designed to ensure practical learning, real-world exposure, and career readiness."
          align="left"
          className="mb-8 sm:mb-12"
        />
      </motion.div>
      <motion.div
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1,
              delayChildren: 0.2,
            },
          },
        }}
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 md:gap-6 max-w-7xl mx-auto"
      >
        {STEPS.map((s, i) => (
          <motion.div key={s.step} variants={fadeUp} custom={i}>
            <ProcessCard {...s} index={i} />
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  )
}

export default HowWeWorkSection

