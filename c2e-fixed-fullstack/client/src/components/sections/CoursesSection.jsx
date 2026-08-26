import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import SectionHeading from '../common/SectionHeading.jsx'
import CourseCard from './cards/CourseCard.jsx'
import { getCourses } from '../../services/courses.js'
import { fadeUp } from '../../utils/animationVariants'

// Homepage "Our Courses" section. Shows a curated grid of real, active
// courses pulled from the API (up to 6) so visitors can immediately see
// actual programs on the homepage. Each card's CTA links to the course
// detail page (/courses/:courseId), where visitors can then enroll
// (/enroll/:courseId). A footer CTA points to the full catalog.
function CoursesSection() {
  const [courses, setCourses] = useState([])
  const [status, setStatus] = useState('loading') // loading | success | error

  useEffect(() => {
    let cancelled = false
    setStatus('loading')

    getCourses()
      .then((res) => {
        if (cancelled) return
        setCourses((res.data || []).slice(0, 6))
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

  return (
    <motion.section
      id="courses"
      className="w-full px-4 sm:px-6 md:px-8 py-10 sm:py-14 md:py-20 bg-white"
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
      <motion.div variants={fadeUp}>
        <SectionHeading
          title="OUR COURSES"
          subtitle="Explore a wide range of industry-relevant courses designed to build future-ready skills."
          align="left"
          className="mb-10 sm:mb-14 md:mb-20"
        />
      </motion.div>

      {status === 'loading' && (
        <p className="text-left text-gray-muted text-sm py-10">Loading courses…</p>
      )}

      {status === 'error' && (
        <p className="text-left text-gray-muted text-sm py-10">
          We couldn't load courses right now. Please try again shortly.
        </p>
      )}

      {status === 'success' && courses.length > 0 && (
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {courses.map((course, i) => (
            <motion.div key={course._id} variants={fadeUp} custom={i}>
              <CourseCard
                title={course.title}
                description={course.description}
                courseId={course._id}
                ctaLabel="View Details"
                index={i}
              />
            </motion.div>
          ))}
        </div>
      )}

      {status === 'success' && courses.length === 0 && (
        <p className="text-left text-gray-muted text-sm py-10">
          No courses are available yet — check back soon!
        </p>
      )}

      <motion.div variants={fadeUp} className="flex justify-center mt-10 sm:mt-14">
        <a
          href="/courses"
          className="inline-flex items-center justify-center rounded-full px-9 py-3.5 text-[11px] sm:text-xs uppercase tracking-[0.08em] text-white bg-pink shadow-[6px_6px_14px_#c9457f,-6px_-6px_14px_#ff5aa3] hover:shadow-[8px_8px_18px_#c9457f,-8px_-8px_18px_#ff64ab] transition-all duration-200 active:translate-y-[1px]"
        >
          View Full Catalog
        </a>
      </motion.div>
    </motion.section>
  )
}

export default CoursesSection

