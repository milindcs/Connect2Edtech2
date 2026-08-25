import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { getCourses } from '../../services/courses.js'

function CourseCard({ course, index = 0 }) {
  const cm = {
    badge: 'ADVANCED TRACK',
    duration: '12 Weeks',
    modules: '24 Modules',
    level: 'Intermediate',
  }

  return (
    <motion.div
      className="rounded-[24px] border border-gray-100 shadow-sm bg-white overflow-hidden transition-all duration-300 hover:shadow-md h-full"
      initial={{ opacity: 0, y: 30 }}
      animate="visible"
      variants={{ visible: { opacity: 1, y: 0 } }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      {/* Card Header */}
      <div className="relative px-6 sm:px-8 pt-10 pb-8">
        <div className="absolute top-4 right-4 sm:top-5 sm:right-5 bg-slate-100 text-slate-700 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wide">
          {cm.badge}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-[17px] sm:text-[19px] font-bold leading-snug tracking-tight text-gray-900">
            {course.title}
          </h3>
          <p className="text-gray-500 text-[13px] sm:text-sm font-medium mt-2 tracking-wide">
            {course.department}
          </p>
        </div>
      </div>

      {/* Card Body */}
      <div className="px-6 sm:px-8 pb-8">
        <p className="text-slate-500 text-[13px] sm:text-sm leading-relaxed font-medium mb-6">
          {course.description}
        </p>

        {/* Footer Metadata */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-100">
          <div className="flex items-center gap-4 sm:gap-6">
            <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-600">
              {cm.duration}
            </span>
            <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-600">
              {cm.modules}
            </span>
            <span className="hidden sm:inline text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-600">
              {cm.level}
            </span>
          </div>
        </div>
      </div>

      {/* Card Actions */}
      <div className="px-6 sm:px-8 pb-8">
        <div className="flex flex-col sm:flex-row items-stretch gap-3">
          <a
            href={`/enroll/${course._id}`}
            className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-[#f0247a] text-white font-semibold shadow-lg shadow-[#f0247a]/25 hover:bg-[#d0246d] transition-all duration-200 text-sm tracking-wide text-center"
          >
            Enroll Now
          </a>
          <a
            href={`/courses/${course._id}`}
            className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-white text-slate-700 font-semibold border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 text-sm tracking-wide text-center"
          >
            Syllabus
          </a>
        </div>
      </div>
    </motion.div>
  )
}

function FutureSkillsSection() {
  const [featuredCourses, setFeaturedCourses] = useState([])
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    let cancelled = false
    setStatus('loading')

    Promise.all([getCourses({ category: 'technical' }), getCourses({ category: 'non-technical' })])
      .then(([techRes, nonTechRes]) => {
        if (cancelled) return
        const tech = (techRes.data || []).filter((c) => c.status === 'Active')[0]
        const nonTech = (nonTechRes.data || []).filter((c) => c.status === 'Active')[0]
        setFeaturedCourses(
          [tech, nonTech].filter(Boolean).map((course, i) => ({
            ...course,
            _displayIndex: i,
          })),
        )
        setStatus('success')
      })
      .catch(() => {
        if (cancelled) return
        setStatus('error')
      })

    return () => {
      cancelled = true
    }
  }, [])

  if (status === 'loading') {
    return (
      <section className="w-full bg-white py-10 sm:py-14 md:py-20 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-accent" />
        </div>
      </section>
    )
  }

  if (status === 'error' || featuredCourses.length === 0) {
    return (
      <section className="w-full bg-white py-10 sm:py-14 md:py-20 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-gray-muted">Could not load courses right now. Please try again shortly.</p>
        </div>
      </section>
    )
  }

  return (
    <motion.section
      className="w-full bg-white py-12 sm:py-16 md:py-20 lg:py-24 font-sans"
      initial={{ opacity: 0, y: 40 }}
      animate="visible"
      variants={{ visible: { opacity: 1, y: 0 } }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12 md:mb-14">
          <span className="inline-block text-indigo-600 font-semibold tracking-wide uppercase text-[10px] sm:text-xs md:text-sm bg-indigo-50 px-3 py-1 rounded-full mb-4">
            Future Skills &amp; Engineering
          </span>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-slate-900 leading-tight tracking-tight">
            Accelerate Your Career with Specialized Tech Tracks
          </h2>
          <p className="text-slate-600 mt-3 sm:mt-4 text-sm sm:text-base md:text-lg leading-relaxed">
            Industry-certified programs engineered to bridge practical coding, hardware-software integration, and modern architectures.
          </p>
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 md:gap-12 max-w-5xl mx-auto">
          {featuredCourses.map((course, i) => (
            <CourseCard key={course._id} course={course} index={i} />
          ))}
        </div>

        <div className="flex justify-center lg:justify-start mt-10 sm:mt-12 md:mt-14">
          <a
            href="/courses"
            className="inline-flex items-center justify-center rounded-full px-7 sm:px-8 md:px-9 py-2.5 sm:py-3 text-[10px] sm:text-xs uppercase tracking-[0.08em] text-white bg-pink shadow-[6px_6px_14px_#c9457f,-6px_-6px_14px_#ff5aa3] hover:shadow-[8px_8px_18px_#c9457f,-8px_-8px_18px_#ff64ab] transition-all duration-200 active:translate-y-[1px] min-h-[44px]"
          >
            View Full Catalog
          </a>
        </div>
      </div>
    </motion.section>
  )
}

export default FutureSkillsSection
