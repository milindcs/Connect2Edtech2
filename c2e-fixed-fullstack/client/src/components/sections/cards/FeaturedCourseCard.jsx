import { motion } from 'framer-motion'
import { COURSE_META, getDepartmentTheme } from '../../../data/courseMeta.js'
import NeuButton from '../../common/NeuButton.jsx'

function FeaturedCourseCard({ course, index = 0, enrollHref, detailHref, enrollLabel = 'Enroll Now', detailLabel = 'Syllabus' }) {
  const cm = COURSE_META[course.title]
  const depTheme = getDepartmentTheme(course.department)

  const badgeBg = (cm && cm.badgeBg) || depTheme.badgeBg
  const badgeText = (cm && cm.badgeText) || depTheme.badgeText
  const badge = (cm && cm.badge) || 'Featured'
  const duration = (cm && cm.duration) || '8 Weeks'
  const level = (cm && cm.level) || 'Beginner'
  const type = (cm && cm.type) || 'Theory & Lab'
  const topics = (cm && cm.topics) || []
  const showMeta = topics.length > 0

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 flex flex-col justify-between transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl w-full h-full"
      initial={{ opacity: 0, y: 30 }}
      animate="visible"
      variants={{ visible: { opacity: 1, y: 0 } }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className="flex-1 flex flex-col">
        {/* Card Header */}
        <div className="px-5 sm:px-6 pt-6 sm:pt-7 pb-2">
          <span className={`inline-block ${badgeBg} ${badgeText} text-[9px] sm:text-[10px] font-bold px-2 py-1 rounded-full mb-3`}>
            {badge}
          </span>
          <h3 className="text-base sm:text-lg font-bold leading-tight text-black">{course.title}</h3>
          <span className="text-[10px] sm:text-xs text-slate-500 mt-1 block">
            {course.department}
          </span>
        </div>

        {/* Card Body */}
        <div className="px-5 sm:px-6 pb-2 flex-1 flex flex-col">
          <p className="text-slate-600 text-xs mb-3 sm:mb-4 leading-relaxed line-clamp-3">
            {course.description}
          </p>

          {showMeta && (
            <>
              {/* Metadata Meta Tags */}
              <div className="flex items-center justify-between text-[10px] text-slate-500 border-t border-b border-slate-100 py-2 sm:py-2.5 mb-3 sm:mb-4">
                <span className="flex items-center gap-1">
                  ⏱️ {duration}
                </span>
                <span className="flex items-center gap-1">
                  📊 {level}
                </span>
                <span className="flex items-center gap-1">
                  💻 {type}
                </span>
              </div>

              {/* Key Topics list */}
              <ul className="space-y-2 text-[10px] sm:text-[11px] text-slate-700">
                {topics.slice(0, 3).map((topic, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1 h-1 bg-indigo-600 rounded-full flex-shrink-0" />
                    <span className="truncate">{topic}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>

      {/* Card Footer / Actions */}
      <div className="p-5 sm:p-6 pt-0 flex flex-col sm:flex-row items-stretch gap-2 sm:gap-3">
        <NeuButton
          href={enrollHref || `/enroll/${course._id}`}
          variant="primary"
          className="flex-1"
        >
          {enrollLabel}
        </NeuButton>
        <NeuButton
          href={detailHref || `/courses/${course._id}`}
          variant="secondary"
          className="flex-1"
        >
          {detailLabel}
        </NeuButton>
      </div>
    </motion.div>
  )
}

export default FeaturedCourseCard
