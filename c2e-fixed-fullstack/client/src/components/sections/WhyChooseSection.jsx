import { BadgeCheck, UserCheck, Award } from 'lucide-react'
import { motion } from 'framer-motion'
import { fadeUp } from '../../utils/animationVariants'
import SectionHeading from '../common/SectionHeading.jsx'
import WhyChooseItem from './cards/WhyChooseItem.jsx'

const ITEMS = [
  { icon: BadgeCheck, label: 'Industry-Relevant Curriculum' },
  { icon: UserCheck, label: 'Expert Mentors & Guidance' },
  { icon: Award, label: 'Placement Assistance' },
]

function WhyChooseSection() {
  return (
      <motion.section
        className="w-full px-4 sm:px-6 md:px-8 py-12 sm:py-16 md:py-20 lg:py-24"
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
          title="Why Choose Connect2Edtech?"
          subtitle="We provide the skills, support, and opportunities you need to succeed in your career."
          align="left"
          className="mb-6 sm:mb-8"
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
        className="flex flex-col md:flex-row items-stretch justify-center gap-3 sm:gap-4 md:gap-6 max-w-4xl mx-auto"
      >
        {ITEMS.map((item, i) => (
          <motion.div key={item.label} variants={fadeUp} custom={i}>
            <div className="flex-1 min-w-0 h-full">
              <WhyChooseItem {...item} />
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  )
}

export default WhyChooseSection

