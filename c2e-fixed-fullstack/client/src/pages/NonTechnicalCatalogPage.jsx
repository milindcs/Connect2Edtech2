import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2, AlertCircle } from 'lucide-react'
import PageShell from '../components/layout/PageShell.jsx'
import CatalogToggle from '../components/common/CatalogToggle.jsx'
import FeaturedCourseCard from '../components/sections/cards/FeaturedCourseCard.jsx'
import { getCourses } from '../services/courses.js'
import { fadeUp } from '../utils/animationVariants'

function NonTechnicalCatalogPage() {
  const [courses, setCourses] = useState([])
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    let cancelled = false
    setStatus('loading')

    getCourses({ category: 'non-technical' })
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
  }, [])

  return (
    <PageShell
      topSlot={<CatalogToggle active="non-technical" />}
      showSharedSections={false}
    >
      <section className="w-full pb-10 sm:pb-14 md:pb-16">
        {status === 'loading' && (
          <div className="flex justify-center py-10">
            <Loader2 className="w-6 h-6 animate-spin text-accent" />
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center gap-3 py-10 text-center">
            <AlertCircle className="w-8 h-8 text-gray-muted" />
            <p className="text-sm text-gray-muted">
              We couldn't load courses right now. Please try again shortly.
            </p>
          </div>
        )}

        {status === 'success' && courses.length === 0 && (
          <p className="text-center text-gray-muted text-sm py-10">
            No non-technical courses are available yet — check back soon!
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
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto"
          >
            {courses.map((course, i) => (
              <motion.div key={course._id} variants={fadeUp} custom={i}>
                <FeaturedCourseCard
                  course={course}
                  index={i}
                  detailLabel="View Details"
                  enrollLabel="Enroll Now"
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>
    </PageShell>
  )
}

export default NonTechnicalCatalogPage
