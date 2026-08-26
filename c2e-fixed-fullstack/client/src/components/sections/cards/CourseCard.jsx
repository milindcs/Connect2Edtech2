import { motion } from 'framer-motion'
import { fadeUp } from '../../../utils/animationVariants'
import { getCourseMeta } from '../../../data/courseMeta.js'
import NeuButton from '../../common/NeuButton.jsx'

function CourseCard({
  title,
  description,
  ctaHref = '#courses',
  ctaLabel = 'View Details',
  secondaryCtaLabel = 'Syllabus',
  courseId = null,
  index = 0,
  meta,
}) {
  const href = courseId ? `/courses/${courseId}` : ctaHref
  const courseMeta = meta || getCourseMeta(title)
  const hasMeta = courseMeta && courseMeta.topics && courseMeta.topics.length > 0

  return (
    <motion.div
      custom={index}
      initial="hidden"
      animate="visible"
      variants={fadeUp}
      className="relative flex flex-col rounded-[24px] bg-white border border-slate-100 shadow-sm overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:shadow-md h-full"
      style={{ boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08)' }}
    >
      {/* Title + description */}
      <div className="flex flex-col items-center text-center gap-3 px-6 sm:px-8 pt-8 pb-2">
        <h3 className="text-black" style={{ fontSize: 'clamp(0.95rem, 1.3vw, 1.15rem)' }}>
          {title}
        </h3>
        <p className="text-slate-500 text-xs sm:text-sm leading-relaxed font-medium line-clamp-2">{description}</p>
      </div>

      {hasMeta && (
        <>
          <div className="px-6 sm:px-8 mt-6 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>⏱️ {courseMeta.duration}</span>
              <span>📊 {courseMeta.level}</span>
              <span>💻 {courseMeta.type}</span>
            </div>
            <ul className="space-y-2">
              {courseMeta.topics.map((topic, idx) => (
                <li key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                  <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full" />
                  {topic}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

      {/* Floating neumorphic button, straddling the card's bottom edge */}
      <div className="relative mt-auto pt-6 pb-8 flex justify-center">
        <NeuButton href={href} variant="primary">
          {ctaLabel}
        </NeuButton>
      </div>
    </motion.div>
  )
}

export default CourseCard
