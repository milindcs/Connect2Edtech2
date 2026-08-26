import { motion } from 'framer-motion'
import { fadeUp } from '../../utils/animationVariants'
import SkillCard from './cards/SkillCard.jsx'
import {
  Code2,
  Database,
  Brain,
  Server,
  LayoutTemplate,
  Network,
} from 'lucide-react'

const SKILL_CATEGORIES = [
  {
    icon: LayoutTemplate,
    title: 'Frontend',
    description: 'Modern UI engineering with React, Next.js, and Tailwind.',
    tags: ['React', 'Next.js', 'Tailwind', 'TypeScript'],
    level: 'Advanced',
    progress: 92,
    accent: 'from-blue-500 to-cyan-400',
  },
  {
    icon: Server,
    title: 'Backend',
    description: 'Scalable APIs, microservices, and cloud-native architecture.',
    tags: ['Node.js', 'Express', 'Python', 'GraphQL'],
    level: 'Advanced',
    progress: 88,
    accent: 'from-emerald-500 to-green-400',
  },
  {
    icon: Brain,
    title: 'AI & Tools',
    description: 'Prompt engineering, automation, and data-driven insights.',
    tags: ['OpenAI', 'LangChain', 'Python', 'Pandas'],
    level: 'Intermediate',
    progress: 78,
    accent: 'from-violet-500 to-purple-400',
  },
  {
    icon: Network,
    title: 'System Design',
    description: 'High-level architecture, caching, queues, and reliability.',
    tags: ['Redis', 'Kafka', 'Docker', 'AWS'],
    level: 'Intermediate',
    progress: 75,
    accent: 'from-orange-500 to-amber-400',
  },
]

function SkillsSection() {
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ backgroundColor: '#000000' }}
    >
      <div className="w-full px-4 sm:px-6 md:px-8 py-16 sm:py-20 md:py-24 lg:py-28">
        <div className="flex flex-col items-center text-center gap-4 sm:gap-5 md:gap-6 mb-12 sm:mb-14 md:mb-16">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="uppercase font-semibold text-white leading-[1.1] tracking-[0.015em]"
            style={{ fontSize: 'clamp(1.25rem, 2.2vw, 1.75rem)' }}
          >
            Elevate Your Skills
            <span className="text-[#F0247A]" aria-hidden="true">
              .
            </span>
          </motion.h2>

          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-gray-400 font-normal leading-relaxed max-w-2xl"
            style={{ fontSize: 'clamp(0.85rem, 1vw, 0.95rem)', lineHeight: 1.65 }}
          >
            Master practical, job-ready skills across modern tech stacks with
            hands-on mentorship, real projects, and placement-focused guidance.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 max-w-7xl mx-auto">
          {SKILL_CATEGORIES.map((category, index) => (
            <motion.div
              key={category.title}
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={fadeUp}
              className="h-full"
            >
              <SkillCard {...category} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default SkillsSection
