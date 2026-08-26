import { useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import PageShell from '../components/layout/PageShell.jsx'
import NeuButton from '../components/common/NeuButton.jsx'
import {
  cardZoomStagger,
  cardWipeStaggerUp,
  cardWipeStaggerLeft,
  cardWipeStaggerRight,
  cardWipeStaggerScale,
  fieldItem,
  fadeUp,
  EASE,
} from '../utils/animationVariants'
import { submitTrainerApplication } from '../services/trainer.js'

const formStagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.05,
    },
  },
}

const SKILL_OPTIONS = [
  'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java',
  'Data Science', 'Machine Learning', 'SQL', 'DevOps', 'UI/UX Design', 'Cloud (AWS/Azure/GCP)',
]

const EXPERIENCE_OPTIONS = [
  'Less than 1 year',
  '1-3 years',
  '3-5 years',
  '5-10 years',
  '10+ years',
]

const initialForm = {
  fullName: '',
  email: '',
  phone: '',
  expertise: [],
  experience: '',
  qualification: '',
  about: '',
}

const inputClasses =
  'w-full rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-200 px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-black placeholder:text-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-shadow'

const labelClasses = 'text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-black/70 mb-1 block'

function TrainerApplication() {
  const [form, setForm] = useState(initialForm)
  const [status, setStatus] = useState('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    if (status === 'error') {
      setStatus('idle')
      setErrorMessage('')
    }
  }

  const toggleExpertise = (value) => {
    setForm((prev) => ({
      ...prev,
      expertise: prev.expertise.includes(value)
        ? prev.expertise.filter((v) => v !== value)
        : [...prev.expertise, value],
    }))
  }

  const isSubmitting = status === 'submitting'

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (isSubmitting) return

    setStatus('submitting')
    setErrorMessage('')

    const cleanedForm = {
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      expertise: form.expertise,
      yearsOfExperience: form.experience,
      qualification: form.qualification.trim(),
      about: form.about.trim(),
    }

    if (!cleanedForm.fullName) {
      setStatus('error')
      setErrorMessage('Please enter your full name.')
      return
    }
    if (!cleanedForm.email) {
      setStatus('error')
      setErrorMessage('Please enter your email address.')
      return
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailPattern.test(cleanedForm.email)) {
      setStatus('error')
      setErrorMessage('Please enter a valid email address.')
      return
    }
    if (!cleanedForm.phone) {
      setStatus('error')
      setErrorMessage('Please enter your phone number.')
      return
    }
    if (cleanedForm.expertise.length === 0) {
      setStatus('error')
      setErrorMessage('Please select at least one area of expertise.')
      return
    }
    if (!cleanedForm.experience) {
      setStatus('error')
      setErrorMessage('Please select your years of experience.')
      return
    }
    if (!cleanedForm.qualification) {
      setStatus('error')
      setErrorMessage('Please enter your qualification.')
      return
    }

    try {
      await submitTrainerApplication(cleanedForm)
      setStatus('success')
      setForm({ ...initialForm })
    } catch (err) {
      setStatus('error')
      setErrorMessage(
        err?.response?.data?.message ||
        err?.message ||
        'Something went wrong submitting your application. Please try again.'
      )
    }
  }

  if (status === 'success') {
    return (
      <PageShell showSharedSections={false}>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={cardZoomStagger}
          className="flex flex-col items-center gap-4 sm:gap-6 px-4 sm:px-5 pb-14 sm:pb-20"
        >
          <motion.div
            initial={{ scale: 0, rotate: -8 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 16, delay: 0.1 }}
          >
            <CheckCircle2 className="w-12 h-12 sm:w-14 sm:h-14 text-emerald-500" />
          </motion.div>

          <motion.h2
            variants={fieldItem}
            className="text-xl sm:text-2xl font-bold text-black text-center"
          >
            Application Submitted!
          </motion.h2>

          <motion.p
            variants={fieldItem}
            className="text-sm text-gray-muted text-center max-w-md"
          >
            Thank you for applying to become a trainer with Connect2EdTech.
            We have received your application and will review it shortly.
            An acknowledgement email has been sent to the address you provided.
          </motion.p>

          <motion.div variants={fieldItem}>
            <NeuButton href="/" variant="primary" className="w-full sm:w-auto min-w-[11rem]">
              Back to Home
            </NeuButton>
          </motion.div>
        </motion.div>
      </PageShell>
    )
  }

  return (
    <PageShell showSharedSections={false}>
      <motion.form
        onSubmit={handleSubmit}
        variants={formStagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.05 }}
        className="w-full max-w-3xl mx-auto px-4 sm:px-0 pb-16 sm:pb-20 flex flex-col gap-5 sm:gap-6"
      >
        <motion.div variants={cardZoomStagger} className="relative text-center mb-2">
          <span aria-hidden="true" className="trainer-hero-blob pointer-events-none absolute inset-x-0 -top-6 flex justify-center">
            <span className="block w-44 h-44 rounded-full bg-[radial-gradient(circle,rgba(240,36,122,0.22),transparent_70%)] blur-2xl" />
          </span>
          <span aria-hidden="true" className="trainer-hero-blob trainer-hero-blob--alt pointer-events-none absolute inset-x-0 -bottom-4 flex justify-center">
            <span className="block w-32 h-32 rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.16),transparent_70%)] blur-2xl" />
          </span>

          <style>{`
            .trainer-hero-blob { animation: trainerHeroFloat 7s ease-in-out infinite; }
            .trainer-hero-blob--alt { animation-duration: 9s; animation-direction: reverse; }
            @keyframes trainerHeroFloat {
              0%, 100% { transform: translateY(0) scale(1); }
              50% { transform: translateY(-12px) scale(1.08); }
            }
            @media (prefers-reduced-motion: reduce) {
              .trainer-hero-blob { animation: none; }
            }
          `}</style>

          <h2 className="relative text-xl sm:text-2xl font-bold text-black tracking-tight">
            Become a Trainer
          </h2>
           <p className="relative text-xs sm:text-sm text-gray-muted mt-1">
            Share your expertise and help shape the next generation of professionals.
          </p>
        </motion.div>

        <motion.div variants={cardWipeStaggerUp}>
          <div className="rounded-[1.25rem] sm:rounded-[1.5rem] p-3.5 sm:p-4 md:p-5 flex flex-col gap-2.5 sm:gap-3 bg-white border border-slate-100 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
            <motion.h3 variants={fieldItem} className="text-xs sm:text-sm font-bold uppercase tracking-widest text-accent">Personal Information</motion.h3>
            <motion.div variants={fieldItem} className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
              <input
                required
                name="fullName"
                placeholder="Full Name"
                value={form.fullName}
                onChange={handleChange}
                disabled={isSubmitting}
                className={inputClasses}
              />
              <input
                required
                type="email"
                name="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                disabled={isSubmitting}
                className={inputClasses}
              />
              <input
                required
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={form.phone}
                onChange={handleChange}
                inputMode="tel"
                disabled={isSubmitting}
                className={inputClasses}
              />
              <input
                name="qualification"
                placeholder="Qualification (e.g. M.Tech Computer Science)"
                value={form.qualification}
                onChange={handleChange}
                disabled={isSubmitting}
                className={inputClasses}
              />
            </motion.div>
          </div>
        </motion.div>

        <motion.div variants={cardWipeStaggerLeft}>
          <div className="rounded-[1.25rem] sm:rounded-[1.5rem] p-3.5 sm:p-4 md:p-5 flex flex-col gap-2.5 sm:gap-3 bg-white border border-slate-100 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
            <motion.h3 variants={fieldItem} className="text-xs sm:text-sm font-bold uppercase tracking-widest text-accent">Skills / Expertise</motion.h3>
            <motion.label variants={fieldItem} className={labelClasses}>Select all that apply</motion.label>
            <motion.div variants={fieldItem} className="flex flex-wrap gap-1.5 sm:gap-2">
              {SKILL_OPTIONS.map((option) => {
                const active = form.expertise.includes(option)
                return (
                  <motion.button
                    type="button"
                    key={option}
                    onClick={() => toggleExpertise(option)}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    transition={{ duration: 0.2, ease: EASE }}
                    className={`px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-xs font-semibold uppercase tracking-wide transition-all duration-200 ${
                      active
                        ? 'bg-pink text-white shadow-[3px_3px_8px_#c9457f,-3px_-3px_8px_#ff5aa3]'
                        : 'bg-slate-50 text-black/70 border border-slate-200 shadow-sm'
                    }`}
                  >
                    {option}
                  </motion.button>
                )
              })}
            </motion.div>
          </div>
        </motion.div>

        <motion.div variants={cardWipeStaggerRight}>
          <div className="rounded-[1.25rem] sm:rounded-[1.5rem] p-3.5 sm:p-4 md:p-5 flex flex-col gap-2.5 sm:gap-3 bg-white border border-slate-100 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
            <motion.h3 variants={fieldItem} className="text-xs sm:text-sm font-bold uppercase tracking-widest text-accent">Experience</motion.h3>
            <motion.div variants={fieldItem}>
              <select
                name="experience"
                value={form.experience}
                onChange={handleChange}
                required
                disabled={isSubmitting}
                className={`${inputClasses} appearance-none pr-8`}
              >
                <option value="">Select your experience</option>
                {EXPERIENCE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </motion.div>
          </div>
        </motion.div>

        <motion.div variants={cardWipeStaggerScale}>
          <div className="rounded-[1.25rem] sm:rounded-[1.5rem] p-3.5 sm:p-4 md:p-5 flex flex-col gap-2.5 sm:gap-3 bg-white border border-slate-100 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
            <motion.h3 variants={fieldItem} className="text-xs sm:text-sm font-bold uppercase tracking-widest text-accent">About / Why Join</motion.h3>
            <motion.div variants={fieldItem}>
              <textarea
                name="about"
                placeholder="Tell us about yourself, your teaching philosophy, and why you want to join Connect2EdTech..."
                value={form.about}
                onChange={handleChange}
                rows={4}
                disabled={isSubmitting}
                className={`${inputClasses} resize-none`}
              />
            </motion.div>
          </div>
        </motion.div>

        <motion.div variants={cardWipeStaggerUp} className="flex flex-col items-center gap-3 pt-1">
          <motion.div variants={fieldItem} className="flex flex-col items-center gap-3">
            <NeuButton type="submit" variant="primary" className="w-full sm:w-auto min-w-[11rem]" disabled={isSubmitting}>
              {isSubmitting ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                  Submitting…
                </span>
              ) : (
                'Submit Application'
              )}
            </NeuButton>

            {status === 'error' && (
              <motion.p
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                role="alert"
                className="flex items-center gap-1.5 text-xs text-red-500 font-semibold"
              >
                <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                {errorMessage}
              </motion.p>
            )}
          </motion.div>
        </motion.div>
      </motion.form>
    </PageShell>
  )
}

export default TrainerApplication
