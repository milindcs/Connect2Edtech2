import { useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2, CheckCircle2, AlertCircle, UploadCloud } from 'lucide-react'
import PageShell from '../components/layout/PageShell.jsx'
import NeuButton from '../components/common/NeuButton.jsx'
import {
  cardZoom,
  cardWipeStaggerUp,
  cardWipeStaggerLeft,
  cardWipeStaggerRight,
  cardWipeStaggerScale,
  cardZoomStagger,
  fieldItem,
  EASE,
} from '../utils/animationVariants'

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

import { submitMentorApplication } from '../services/mentor.js'

const SKILL_OPTIONS = [
  'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java',
  'Data Science', 'Machine Learning', 'SQL', 'DevOps', 'UI/UX Design', 'Cloud (AWS/Azure/GCP)',
]

const COURSE_OPTIONS = [
  'Full Stack Web Development', 'Data Science & Analytics', 'Frontend Development',
  'Backend Development', 'Machine Learning', 'DevOps',
]

const AVAILABILITY_OPTIONS = ['Weekdays', 'Weekends', 'Remote', 'Hybrid', 'Offline']

const initialForm = {
  fullName: '',
  email: '',
  phone: '',
  city: '',
  state: '',
  currentCompany: '',
  currentDesignation: '',
  yearsOfExperience: '',
  skills: [],
  coursesInterested: [],
  previousTeachingExperience: '',
  linkedin: '',
  github: '',
  portfolio: '',
  motivation: '',
  availability: [],
  agreed: false,
}

const inputClasses =
  'w-full rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-200 px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-black placeholder:text-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-shadow'

const labelClasses = 'text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-black/70 mb-1 block'

function Fieldset({ title, children }) {
  return (
    <div className="rounded-[1.25rem] sm:rounded-[1.5rem] p-3.5 sm:p-4 md:p-5 flex flex-col gap-2.5 sm:gap-3 bg-white border border-slate-100 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      <motion.h3 variants={fieldItem} className="text-xs sm:text-sm font-bold uppercase tracking-widest text-accent">{title}</motion.h3>
      <motion.div variants={fieldItem}>{children}</motion.div>
    </div>
  )
}

function MultiChoice({ options, selected, onToggle }) {
  return (
    <div className="flex flex-wrap gap-1.5 sm:gap-2">
      {options.map((option) => {
        const active = selected.includes(option)
        return (
          <motion.button
            type="button"
            key={option}
            onClick={() => onToggle(option)}
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
    </div>
  )
}

function MentorApplication() {
  const [form, setForm] = useState(initialForm)
  const [resumeFile, setResumeFile] = useState(null)
  const [resumeError, setResumeError] = useState('')
  const [status, setStatus] = useState('idle') // idle | submitting | success | error
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const toggleMulti = (field, value) => {
    setForm((prev) => {
      const list = prev[field]
      return {
        ...prev,
        [field]: list.includes(value) ? list.filter((v) => v !== value) : [...list, value],
      }
    })
  }

  const handleResumeChange = (e) => {
    const file = e.target.files?.[0]
    setResumeError('')
    if (!file) {
      setResumeFile(null)
      return
    }

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ]
    if (!allowedTypes.includes(file.type)) {
      setResumeError('Only PDF, DOC, or DOCX files are accepted.')
      setResumeFile(null)
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setResumeError('File is too large — maximum size is 5 MB.')
      setResumeFile(null)
      return
    }
    setResumeFile(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!resumeFile) {
      setResumeError('Please attach your resume (PDF, DOC, or DOCX, max 5 MB).')
      return
    }
    if (!form.agreed) {
      setErrorMessage('Please agree to the terms before submitting.')
      setStatus('error')
      return
    }

    setStatus('submitting')
    setErrorMessage('')

    try {
      const data = new FormData()
      Object.entries(form).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          data.append(key, JSON.stringify(value))
        } else {
          data.append(key, value)
        }
      })
      data.append('resume', resumeFile)

      await submitMentorApplication(data)
      setStatus('success')
      setForm(initialForm)
      setResumeFile(null)
    } catch (err) {
      setStatus('error')
      setErrorMessage(
        err?.response?.data?.message || 'Something went wrong submitting your application. Please try again.'
      )
    }
  }

  if (status === 'success') {
    return (
      <PageShell showSharedSections={false}>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={cardZoom}
          className="flex flex-col items-center gap-4 sm:gap-6 px-4 sm:px-5 pb-14 sm:pb-20"
        >
          <motion.div
            initial={{ scale: 0, rotate: -8 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 16, delay: 0.1 }}
          >
            <CheckCircle2 className="w-12 h-12 sm:w-14 sm:h-14 text-emerald-500" />
          </motion.div>
          <NeuButton href="/" variant="primary" className="w-full sm:w-auto min-w-[11rem]">
            Back to Home
          </NeuButton>
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
          {/* Gentle floating decorative elements behind the heading */}
          <span aria-hidden="true" className="mentor-hero-blob pointer-events-none absolute inset-x-0 -top-6 flex justify-center">
            <span className="block w-44 h-44 rounded-full bg-[radial-gradient(circle,rgba(240,36,122,0.22),transparent_70%)] blur-2xl" />
          </span>
          <span aria-hidden="true" className="mentor-hero-blob mentor-hero-blob--alt pointer-events-none absolute inset-x-0 -bottom-4 flex justify-center">
            <span className="block w-32 h-32 rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.16),transparent_70%)] blur-2xl" />
          </span>

          <style>{`
            .mentor-hero-blob { animation: mentorHeroFloat 7s ease-in-out infinite; }
            .mentor-hero-blob--alt { animation-duration: 9s; animation-direction: reverse; }
            @keyframes mentorHeroFloat {
              0%, 100% { transform: translateY(0) scale(1); }
              50% { transform: translateY(-12px) scale(1.08); }
            }
            @media (prefers-reduced-motion: reduce) {
              .mentor-hero-blob { animation: none; }
            }
          `}</style>

          <h2 className="relative text-xl sm:text-2xl font-bold text-black tracking-tight">Become a Mentor</h2>
          <p className="relative text-xs sm:text-sm text-gray-muted mt-1">Share your expertise and help shape the next generation of professionals.</p>
        </motion.div>

        <motion.div variants={cardWipeStaggerUp}>
          <Fieldset title="Personal Information">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
              <input required name="fullName" placeholder="Full Name" value={form.fullName} onChange={handleChange} className={inputClasses} />
              <input required type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} className={inputClasses} />
              <input required name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} className={inputClasses} />
              <input name="city" placeholder="City" value={form.city} onChange={handleChange} className={inputClasses} />
              <div className="sm:col-span-2">
                <input required name="state" placeholder="State" value={form.state} onChange={handleChange} className={inputClasses} />
              </div>
            </div>
          </Fieldset>
        </motion.div>

        <motion.div variants={cardWipeStaggerLeft}>
          <Fieldset title="Professional Information">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
              <input required name="currentCompany" placeholder="Current Company" value={form.currentCompany} onChange={handleChange} className={inputClasses} />
              <input required name="currentDesignation" placeholder="Current Designation" value={form.currentDesignation} onChange={handleChange} className={inputClasses} />
              <div className="sm:col-span-2">
                <input
                  required
                  type="number"
                  min="0"
                  step="0.5"
                  name="yearsOfExperience"
                  placeholder="Years of Experience"
                  value={form.yearsOfExperience}
                  onChange={handleChange}
                  className={inputClasses}
                />
              </div>
            </div>
          </Fieldset>
        </motion.div>

        <motion.div variants={cardWipeStaggerRight}>
          <Fieldset title="Skills">
            <label className={labelClasses}>Select all that apply</label>
            <MultiChoice options={SKILL_OPTIONS} selected={form.skills} onToggle={(v) => toggleMulti('skills', v)} />
          </Fieldset>
        </motion.div>

        <motion.div variants={cardWipeStaggerScale}>
          <Fieldset title="Teaching Information">
            <label className={labelClasses}>Courses Interested in Teaching</label>
            <MultiChoice
              options={COURSE_OPTIONS}
              selected={form.coursesInterested}
              onToggle={(v) => toggleMulti('coursesInterested', v)}
            />

            <textarea
              name="previousTeachingExperience"
              placeholder="Previous Teaching Experience (optional)"
              value={form.previousTeachingExperience}
              onChange={handleChange}
              rows={3}
              className={`${inputClasses} resize-none`}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
              <input name="linkedin" placeholder="LinkedIn URL" value={form.linkedin} onChange={handleChange} className={inputClasses} />
              <input name="github" placeholder="GitHub URL" value={form.github} onChange={handleChange} className={inputClasses} />
              <div className="sm:col-span-2">
                <input name="portfolio" placeholder="Portfolio Website" value={form.portfolio} onChange={handleChange} className={inputClasses} />
              </div>
            </div>
          </Fieldset>
        </motion.div>

        <motion.div variants={cardWipeStaggerUp}>
          <Fieldset title="Resume">
            <label
              htmlFor="resume-upload"
              className="bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-6 sm:py-8 flex flex-col items-center justify-center gap-2 cursor-pointer text-center"
            >
              <UploadCloud className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
              <span className="text-[10px] sm:text-xs text-slate-500 font-medium">
                {resumeFile ? resumeFile.name : 'Click to upload PDF, DOC, or DOCX (max 5 MB)'}
              </span>
              <input
                id="resume-upload"
                type="file"
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={handleResumeChange}
                className="hidden"
              />
            </label>
            {resumeError && (
              <p className="flex items-center gap-1.5 text-[10px] sm:text-xs text-red-500 font-semibold">
                <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> {resumeError}
              </p>
            )}
          </Fieldset>
        </motion.div>

        <motion.div variants={cardWipeStaggerLeft}>
          <Fieldset title="Motivation">
            <textarea
              required
              name="motivation"
              placeholder="Why do you want to mentor with Connect2Edtech?"
              value={form.motivation}
              onChange={handleChange}
              rows={3}
              className={`${inputClasses} resize-none`}
            />
          </Fieldset>
        </motion.div>

        <motion.div variants={cardWipeStaggerRight}>
          <Fieldset title="Availability">
            <MultiChoice
              options={AVAILABILITY_OPTIONS}
              selected={form.availability}
              onToggle={(v) => toggleMulti('availability', v)}
            />
          </Fieldset>
        </motion.div>

        <motion.div variants={cardZoomStagger}>
          <motion.label variants={fieldItem} className="flex items-start gap-2 sm:gap-3 text-[10px] sm:text-xs text-gray-muted px-1">
            <input
              type="checkbox"
              name="agreed"
              checked={form.agreed}
              onChange={handleChange}
              className="mt-0.5 w-3.5 h-3.5 sm:w-4 sm:h-4 accent-pink flex-shrink-0"
            />
            <span className="leading-relaxed">I confirm that the information provided is accurate and I agree to Connect2Edtech's mentor terms &amp; conditions.</span>
          </motion.label>
        </motion.div>

        <motion.div variants={cardWipeStaggerScale} className="flex flex-col items-center gap-3 pt-1">
          <motion.div variants={fieldItem} className="flex flex-col items-center gap-3">
          <NeuButton type="submit" variant="primary" className="w-full sm:w-auto min-w-[11rem]">
            {status === 'submitting' ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Submitting…
              </span>
            ) : (
              'Submit Application'
            )}
          </NeuButton>

          {status === 'error' && (
            <p className="flex items-center gap-1.5 text-xs text-red-500 font-semibold">
              <AlertCircle className="w-4 h-4" /> {errorMessage}
            </p>
          )}
          </motion.div>
        </motion.div>
      </motion.form>
    </PageShell>
  )
}

export default MentorApplication

