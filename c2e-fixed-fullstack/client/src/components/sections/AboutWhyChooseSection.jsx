import { motion } from 'framer-motion'
import { UserCheck, Hammer, Briefcase, BadgeCheck, Layers, Compass } from 'lucide-react'
import {
  whyCardStagger,
  whyCardItem,
  whyIconPop,
  whyTextSlide,
  fadeUp,
} from '../../utils/animationVariants'
import SectionHeading from '../common/SectionHeading.jsx'
import SectionShell from '../common/SectionShell.jsx'

const FEATURES = [
  { icon: UserCheck, title: 'Industry Mentors', text: 'Learn directly from professionals currently working in the field.' },
  { icon: Hammer, title: 'Practical Learning', text: 'Hands-on, project-first curriculum over passive theory.' },
  { icon: Briefcase, title: 'Placement Support', text: 'Dedicated guidance to help you land the right role.' },
  { icon: BadgeCheck, title: 'Certifications', text: 'Recognized certificates that validate your new skills.' },
  { icon: Layers, title: 'Live Projects', text: 'Build real, portfolio-ready work alongside your mentors.' },
  { icon: Compass, title: 'Career Guidance', text: 'One-on-one support to help you choose the right path.' },
]

function AboutWhyChooseSection() {
  return (
    <SectionShell tone="grey">
      <section className="w-full">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
          className="mb-8 sm:mb-10 md:mb-12"
        >
          <SectionHeading
            title="Why Choose Connect2Edtech"
            subtitle="A few of the things that set our learning experience apart."
            align="left"
          />
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={whyCardStagger}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5 max-w-7xl mx-auto"
        >
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              variants={whyCardItem}
              custom={i}
              className="glass-card rounded-[1.25rem] sm:rounded-[1.5rem] p-4 sm:p-5 md:p-6 flex items-start gap-3 sm:gap-4"
            >
              <motion.span
                variants={whyIconPop}
                className="glass-icon-glow w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center flex-shrink-0"
              >
                <feature.icon className="w-4 h-4 sm:w-5 sm:h-5 text-pink" strokeWidth={1.8} />
              </motion.span>
              <div className="flex flex-col gap-1">
                <motion.h3 variants={whyTextSlide} className="text-black text-sm sm:text-base font-semibold">{feature.title}</motion.h3>
                <motion.p variants={whyTextSlide} className="text-slate-500 text-xs sm:text-sm leading-relaxed font-medium">{feature.text}</motion.p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </SectionShell>
  )
}

export default AboutWhyChooseSection
