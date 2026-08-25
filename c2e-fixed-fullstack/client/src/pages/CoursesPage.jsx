import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import PageShell from '../components/layout/PageShell.jsx'
import CourseCard from '../components/sections/cards/CourseCard.jsx'
import CatalogToggle from '../components/common/CatalogToggle.jsx'
import { getCourses } from '../services/courses.js'
import { fadeUp } from '../utils/animationVariants'

// /courses — the unified "Courses" page listing every active course across
// all departments. Uses the same white CourseCard style as the homepage
// "Our Courses" section. Each card's CTA links to the course detail page
// (/courses/:courseId), where visitors can then enroll
// (/enroll/:courseId). The toggle at the top lets visitors filter inline
// between All, Technical and Non-Technical courses.
function CoursesPage() {
  const [courses, setCourses] = useState([])
  const [category, setCategory] = useState('all') // all | technical | non-technical
  const [status, setStatus] = useState('loading') // loading | success | error

  useEffect(() => {
    let cancelled = false
    setStatus('loading')

    const params = category === 'all' ? {} : { category }
    getCourses(params)
      .then((res) => {
        if (cancelled) return
        setCourses(res.data || [])
        setStatus('success')
      })
      .catch(() => {
        if (cancelled) return
        setStatus('error')
      })

    return () => {
      cancelled = true
    }
  }, [category])

  return (
    <PageShell showSharedSections={false}>
      <section className="w-full px-4 sm:px-6 md:px-8 pb-10 sm:pb-14 md:pb-16">
        <div className="flex justify-center mb-6 sm:mb-8">
          <CatalogToggle active={category} onSelect={setCategory} />
        </div>

        {status === 'loading' && (
          <p className="text-center text-gray-muted text-sm py-10">Loading courses…</p>
        )}

        {status === 'error' && (
          <p className="text-center text-gray-muted text-sm py-10">
            We couldn't load courses right now. Please try again shortly.
          </p>
        )}

        {status === 'success' && courses.length === 0 && (
          <p className="text-center text-gray-muted text-sm py-10">
            No courses are available yet — check back soon!
          </p>
        )}

        {status === 'success' && courses.length > 0 && (
          <motion.div
            key={category}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.08,
                  delayChildren: 0.1,
                },
              },
            }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto"
          >
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
          </motion.div>
        )}
      </section>
    </PageShell>
  )
}

export default CoursesPage


