import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import PageShell from '../components/layout/PageShell.jsx'
import FeaturedCourseCard from '../components/sections/cards/FeaturedCourseCard.jsx'
import { getCourses } from '../services/courses.js'
import { fadeUp } from '../utils/animationVariants'

// Shared implementation behind every /courses/:department route. Reuses the
// exact same CourseCard used on the homepage, and shows only image, title,
// and description per course (no duration/fees/etc), fed live from MongoDB
// via GET /api/courses?department=...
function CourseCategoryPage({ department, topSlot }) {
  const [courses, setCourses] = useState([])
  const [status, setStatus] = useState('loading') // loading | success | error

  useEffect(() => {
    let cancelled = false
    setStatus('loading')

    getCourses({ department })
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
  }, [department])

  return (
    <PageShell topSlot={topSlot}>
      <section className="w-full px-4 sm:px-6 md:px-8 pb-10 sm:pb-14 md:pb-16">
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
            No courses are available in this category yet — check back soon!
          </p>
        )}

         {status === 'success' && courses.length > 0 && (
             <motion.div
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
               className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5 max-w-6xl mx-auto"
             >
             {courses.map((course, i) => (
               <motion.div key={course._id} variants={fadeUp} custom={i}>
                 <FeaturedCourseCard course={course} index={i} />
               </motion.div>
             ))}
           </motion.div>
         )}
      </section>
    </PageShell>
  )
}

export default CourseCategoryPage


