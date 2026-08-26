import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { getCourses } from '../../services/courses.js'
import FeaturedCourseCard from './cards/FeaturedCourseCard.jsx'
import { fadeUp } from '../../utils/animationVariants'

const FeaturedCoursesSection = () => {
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 flex justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-accent" />
        </div>
      </section>
    )
  }

  if (status === 'error' || featuredCourses.length === 0) {
    return (
      <section className="w-full bg-white py-10 sm:py-14 md:py-20 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 text-center">
          <p className="text-sm text-gray-muted">Could not load courses right now. Please try again shortly.</p>
        </div>
      </section>
    )
  }

  return (
    <motion.section
      className="w-full bg-white py-12 sm:py-16 md:py-20 lg:py-24 font-sans"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.15,
            delayChildren: 0.1,
          },
        },
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <motion.div variants={fadeUp} className="flex flex-col items-center lg:items-end max-w-3xl mb-8 sm:mb-10 md:mb-12">
          <div className="text-center lg:text-left max-w-3xl">
            <span className="text-indigo-600 font-semibold tracking-wide uppercase text-[10px] sm:text-xs md:text-sm bg-indigo-50 px-3 py-1 rounded-full">
              Future Skills &amp; Engineering
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-slate-900 mt-2 sm:mt-3">
              Accelerate Your Career with Specialized Tech Tracks
            </h2>
            <p className="text-slate-600 mt-2 sm:mt-3 text-sm sm:text-base md:text-lg">
              Industry-certified programs engineered to bridge practical coding, hardware-software integration, and modern architectures.
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 max-w-5xl mx-auto">
          {featuredCourses.map((course, i) => (
            <motion.div key={course._id} variants={fadeUp} custom={i}>
              <FeaturedCourseCard
                course={course}
                index={course._displayIndex}
              />
            </motion.div>
          ))}
        </div>

        <motion.div variants={fadeUp} className="flex justify-center lg:justify-start mt-8 sm:mt-10 md:mt-12">
          <a
            href="/courses"
            className="inline-flex items-center justify-center rounded-full px-7 sm:px-8 md:px-9 py-2.5 sm:py-3 text-[10px] sm:text-xs uppercase tracking-[0.08em] text-white bg-pink shadow-[6px_6px_14px_#c9457f,-6px_-6px_14px_#ff5aa3] hover:shadow-[8px_8px_18px_#c9457f,-8px_-8px_18px_#ff64ab] transition-all duration-200 active:translate-y-[1px] min-h-[44px]"
          >
            View Full Catalog
          </a>
        </motion.div>
      </div>
    </motion.section>
  )
}

export default FeaturedCoursesSection
