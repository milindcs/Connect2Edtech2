import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Loader2, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react'
import PageShell from '../components/layout/PageShell.jsx'
import NeuButton from '../components/common/NeuButton.jsx'
import { fadeUp } from '../utils/animationVariants'
import { getCourseById } from '../services/courses.js'
import { toAbsoluteUrl } from '../utils/toAbsoluteUrl.js'

// /courses/:courseId — individual course detail page reached from a course
// card ("View Details"). Shows the full course information and a prominent
// "Enroll Now" CTA that links to /enroll/:courseId.
function CourseDetailPage() {
  const { courseId } = useParams()
  const [course, setCourse] = useState(null)
  const [status, setStatus] = useState('loading') // loading | success | error | unavailable
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let cancelled = false
    setStatus('loading')

    getCourseById(courseId)
      .then((res) => {
        if (cancelled) return
        if (res?.data?.status !== 'Active') {
          setStatus('unavailable')
          setErrorMessage('This course is currently not available.')
          return
        }
        setCourse(res.data)
        setStatus('success')
      })
      .catch(() => {
        if (cancelled) return
        setStatus('unavailable')
        setErrorMessage('We could not find this course. It may have been removed.')
      })

    return () => {
      cancelled = true
    }
  }, [courseId])

  if (status === 'loading') {
    return (
      <PageShell showSharedSections={false}>
        <div className="flex justify-center pb-20">
          <Loader2 className="w-6 h-6 animate-spin text-accent" />
        </div>
      </PageShell>
    )
  }

  if (status === 'unavailable') {
    return (
      <PageShell showSharedSections={false}>
        <div className="flex flex-col items-center gap-6 px-5 pb-20">
          <AlertCircle className="w-14 h-14 text-red-500" />
          <p className="text-sm text-gray-muted text-center max-w-md">{errorMessage}</p>
          <NeuButton href="/#courses" variant="primary">
            Browse Courses
          </NeuButton>
        </div>
      </PageShell>
    )
  }

  return (
    <PageShell>
      <div className="w-full max-w-4xl mx-auto pb-16 sm:pb-20 flex flex-col gap-6 sm:gap-8">
        {/* Course image */}
        <motion.div initial="hidden" animate="visible"custom={0} variants={fadeUp}>
          <div className="rounded-[1.5rem] overflow-hidden bg-slate-50 border border-slate-200">
            {course.image ? (
              <img
                src={toAbsoluteUrl(course.image)}
                alt={course.title}
                className="w-full h-48 sm:h-64 md:h-72 object-cover"
              />
            ) : (
              <div className="w-full h-48 sm:h-64 md:h-72 flex items-center justify-center text-gray-muted text-xs sm:text-sm uppercase tracking-widest">
                {course.title}
              </div>
            )}
          </div>
        </motion.div>

        {/* Description */}
        <motion.div initial="hidden" animate="visible"custom={1} variants={fadeUp}>
          <div className="rounded-[1.25rem] sm:rounded-[1.5rem] p-4 sm:p-6 md:p-7 flex flex-col gap-3 sm:gap-4 bg-white border border-slate-100 shadow-sm">
            <h2 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-accent">About This Course</h2>
            <p className="text-slate-500 text-xs sm:text-sm md:text-base leading-relaxed font-medium">{course.description}</p>
          </div>
        </motion.div>

        {/* Quick info */}
        <motion.div initial="hidden" animate="visible"custom={2} variants={fadeUp}>
          <div className="rounded-[1.25rem] sm:rounded-[1.5rem] p-4 sm:p-6 md:p-7 flex flex-col gap-3 sm:gap-4 bg-white border border-slate-100 shadow-sm">
            <h2 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-accent">Course Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
              <div className="flex items-center justify-between gap-4 border-b border-black/5 pb-2 sm:pb-3">
                <span className="text-gray-muted">Department</span>
                <span className="font-semibold text-black text-right">{course.department}</span>
              </div>
              <div className="flex items-center justify-between gap-4 border-b border-black/5 pb-2 sm:pb-3">
                <span className="text-gray-muted">Category</span>
                <span className="font-semibold text-black text-right capitalize">{course.category}</span>
              </div>
              <div className="flex items-center justify-between gap-4 border-b border-black/5 pb-2 sm:pb-3">
                <span className="text-gray-muted">Status</span>
                <span className="font-semibold text-emerald-600">Active</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="flex flex-col items-center gap-3 pt-1"
          >
          <NeuButton href={`/enroll/${course._id}`} variant="primary" icon={ArrowRight}>
            Enroll Now
          </NeuButton>
          <NeuButton href="/#courses" variant="secondary" icon={ArrowLeft}>
            Back to Courses
          </NeuButton>
        </motion.div>
      </div>
    </PageShell>
  )
}

export default CourseDetailPage

