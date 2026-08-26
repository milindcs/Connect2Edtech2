import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import PageShell from '../components/layout/PageShell.jsx'
import NeuButton from '../components/common/NeuButton.jsx'
import { fadeUp } from '../utils/animationVariants'
import { getCourseById } from '../services/courses.js'
import { toAbsoluteUrl } from '../utils/toAbsoluteUrl.js'

const inputClasses =
  'w-full rounded-2xl bg-slate-50 border border-slate-200 px-4 py-3 text-sm text-black placeholder:text-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-shadow'

const initialForm = {
  fullName: '',
  email: '',
  phone: '',
  city: '',
  state: '',
  message: '',
  agreed: false,
}

function Fieldset({ title, children }) {
  return (
    <div className="rounded-[1.5rem] p-5 sm:p-7 flex flex-col gap-4 bg-white border border-slate-100 shadow-sm">
      <h3 className="text-sm font-bold uppercase tracking-widest text-accent">{title}</h3>
      {children}
    </div>
  )
}

function EnrollmentPage() {
  const { courseId } = useParams()
  const [course, setCourse] = useState(null)
  const [courseStatus, setCourseStatus] = useState('loading') // loading | success | error
  const [form, setForm] = useState(initialForm)
  const [status, setStatus] = useState('idle') // idle | submitting | success | error
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let cancelled = false
    setCourseStatus('loading')

    getCourseById(courseId)
      .then((res) => {
        if (cancelled) return
        if (res?.data?.status !== 'Active') {
          setCourseStatus('error')
          setErrorMessage('This course is currently not available for enrollment.')
          return
        }
        setCourse(res.data)
        setCourseStatus('success')
      })
      .catch(() => {
        if (cancelled) return
        setCourseStatus('error')
        setErrorMessage('We could not find this course. It may have been removed.')
      })

    return () => {
      cancelled = true
    }
  }, [courseId])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.agreed) {
      setStatus('error')
      setErrorMessage('Please agree to the terms before enrolling.')
      return
    }

    setStatus('submitting')
    setErrorMessage('')

    try {
      const { submitEnrollment } = await import('../services/enrollment.js')
      await submitEnrollment({ ...form, courseId })
      setStatus('success')
      setForm(initialForm)
    } catch (err) {
      setStatus('error')
      setErrorMessage(
        err?.response?.data?.message || 'Something went wrong submitting your enrollment. Please try again.'
      )
    }
  }

  if (courseStatus === 'loading') {
    return (
      <PageShell showSharedSections={false}>
        <div className="flex justify-center pb-20">
          <Loader2 className="w-6 h-6 animate-spin text-accent" />
        </div>
      </PageShell>
    )
  }

  if (courseStatus === 'error') {
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

  if (status === 'success') {
    return (
      <PageShell showSharedSections={false}>
        <div className="flex flex-col items-center gap-6 px-5 pb-20">
          <CheckCircle2 className="w-16 h-16 text-emerald-500" />
          <NeuButton href="/" variant="primary">
            Back to Home
          </NeuButton>
        </div>
      </PageShell>
    )
  }

  return (
    <PageShell>
      <div className="w-full max-w-3xl mx-auto pb-16 sm:pb-20 flex flex-col gap-5 sm:gap-6">
        {/* Course summary card */}
        <motion.div initial="hidden" animate="visible" custom={0} variants={fadeUp}>
          <div className="rounded-[1.25rem] sm:rounded-[1.5rem] p-4 sm:p-5 md:p-6 flex flex-col sm:flex-row items-center gap-4 sm:gap-5 bg-white border border-slate-100 shadow-sm">
            {course.image ? (
              <img
                src={toAbsoluteUrl(course.image)}
                alt={course.title}
                 className="w-full sm:w-40 h-40 sm:h-32 object-cover rounded-xl bg-slate-50 border border-slate-200"
              />
            ) : (
              <div className="w-full sm:w-40 h-40 sm:h-32 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 text-xs uppercase tracking-widest font-medium">
                Course
              </div>
            )}
            <div className="text-center sm:text-left">
              <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-accent">{course.department}</p>
              <h2 className="text-base sm:text-lg font-bold text-black mt-1">{course.title}</h2>
              <p className="text-xs sm:text-sm text-gray-muted mt-1 leading-relaxed">{course.description}</p>
            </div>
          </div>
        </motion.div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 sm:gap-6">
          <motion.div initial="hidden" animate="visible" custom={1} variants={fadeUp}>
            <Fieldset title="Student Information">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <input required name="fullName" placeholder="Full Name" value={form.fullName} onChange={handleChange} className={inputClasses} />
                <input required type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} className={inputClasses} />
                <input required name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} className={inputClasses} />
                <input name="city" placeholder="City" value={form.city} onChange={handleChange} className={inputClasses} />
                <input name="state" placeholder="State" value={form.state} onChange={handleChange} className={inputClasses} />
              </div>
            </Fieldset>
          </motion.div>

          <motion.div initial="hidden" animate="visible" custom={2} variants={fadeUp}>
            <Fieldset title="Additional Information">
              <textarea
                name="message"
                placeholder="Questions or comments about this course (optional)"
                value={form.message}
                onChange={handleChange}
                rows={3}
                className={`${inputClasses} resize-none`}
              />
            </Fieldset>
          </motion.div>

          <label className="flex items-start gap-2.5 sm:gap-3 text-[10px] sm:text-xs text-gray-muted px-1">
            <input
              type="checkbox"
              name="agreed"
              checked={form.agreed}
              onChange={handleChange}
              className="mt-0.5 w-3.5 h-3.5 sm:w-4 sm:h-4 accent-pink"
            />
            I confirm that the information provided is accurate and I agree to Connect2Edtech's
            enrollment terms &amp; conditions.
          </label>

          <div className="flex flex-col items-center gap-3 pt-1">
            <NeuButton type="submit" variant="primary" className="min-w-[11rem]">
              {status === 'submitting' ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> Submitting…
                </span>
              ) : (
                'Enroll Now'
              )}
            </NeuButton>

            {status === 'error' && (
              <p className="flex items-center gap-1.5 text-xs text-red-500 font-semibold">
                <AlertCircle className="w-4 h-4" /> {errorMessage}
              </p>
            )}
          </div>
        </form>
      </div>
    </PageShell>
  )
}

export default EnrollmentPage

