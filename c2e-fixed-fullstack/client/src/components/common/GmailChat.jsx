import { useState, useRef, useEffect } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { CONTACT } from '../../constants/contacts.js'
import { EASE } from '../../utils/animationVariants'

const gmailComposeUrl = (subject, body) => {
  const params = new URLSearchParams({
    view: 'cm',
    fs: '1',
    to: CONTACT.email,
    su: subject,
    body: body,
  })
  return `https://mail.google.com/mail/?${params.toString()}`
}

const defaultMessage =
  "Hello Connect2EdTech Team,\n\nI would like to know more about your courses and services.\n\nThank you."

const OPTIONS = [
  {
    label: 'Send an Enquiry',
    subject: 'Connect2EdTech Enquiry',
    message: defaultMessage,
  },
  {
    label: 'Become a Trainer',
    subject: 'Become a Trainer - Connect2EdTech',
    message:
      "Hello Connect2EdTech Team,\n\nI'm interested in becoming a trainer with Connect2EdTech. Please find my details below.\n\nThank you.",
  },
  {
    label: 'Course Enquiry',
    subject: 'Course Enquiry - Connect2EdTech',
    message:
      "Hello Connect2EdTech Team,\n\nI would like to know more about your courses and programs.\n\nThank you.",
  },
  {
    label: 'Contact Support',
    subject: 'Support Request - Connect2EdTech',
    message:
      "Hello Connect2EdTech Support,\n\nI need assistance with:\n\nThank you.",
  },
]

function GmailIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="relative z-10 w-5 h-5 sm:w-6 sm:h-6 shrink-0"
    >
      <path d="M12 15.75V10.5h1.5v5.25H12Zm3.75-7.5V6.25A3.75 3.75 0 0 0 12 2.5 3.75 3.75 0 0 0 8.25 6.25V8.25h1.5V6.25a2.25 2.25 0 1 1 4.5 0v2.5h1.5Z" />
      <path d="M18.75 7.5H18V6.25a4.5 4.5 0 0 0-9 0V7.5h7.5V9a3 3 0 0 0 3-3V7.5a3 3 0 0 0-3-3H11.25a3 3 0 0 0-3 3v4.5A3 3 0 0 0 11.25 15h7.5a3 3 0 0 0 3-3v-1.5a3 3 0 0 0-3-3Zm0 4.5H11.25v-3H18.75v3Z" />
    </svg>
  )
}

const GmailIconSimple = () => (
  <svg
    aria-hidden="true"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="relative z-10 w-5 h-5 sm:w-6 sm:h-6 shrink-0"
  >
    <path d="M20 4H4C2.89 4 2 4.89 2 6V8L10.6667 12C11.2333 12.3 12.7667 12.3 13.3333 12L22 8V6C22 4.89 21.1046 4 20 4Z" />
    <path d="M22 12V18C22 19.1046 21.1046 20 20 20H4C2.89 20 2 19.1046 2 18V12L10.6667 15.5C11.2333 15.7 12.7667 15.7 13.3333 15.5L22 12Z" />
  </svg>
)

function GmailChat() {
  const [isOpen, setIsOpen] = useState(false)
  const buttonRef = useRef(null)
  const popupRef = useRef(null)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event.target) &&
        popupRef.current &&
        !popupRef.current.contains(event.target)
      ) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleOpenGmail = (subject, message) => {
    const url = gmailComposeUrl(subject, message)
    window.open(url, '_blank', 'noopener,noreferrer')
    setIsOpen(false)
  }

  return (
    <div
      className="
        fixed
        bottom-4
        right-4
        sm:bottom-6
        sm:right-6
        z-[9999]
       
      "
    >
      {/* ============================================================ */}
      {/* CHAT POPUP                                                  */}
      {/* ============================================================ */}
      {isOpen && (
        <motion.div
          ref={popupRef}
          initial={
            shouldReduceMotion
              ? { opacity: 1 }
              : { opacity: 0, y: 16, scale: 0.96 }
          }
          animate={
            shouldReduceMotion
              ? { opacity: 1 }
              : { opacity: 1, y: 0, scale: 1 }
          }
          exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.96 }}
          transition={{
            duration: shouldReduceMotion ? 0 : 0.3,
            ease: EASE,
          }}
          className="
            absolute
            bottom-16
            sm:bottom-20
            right-0
            mb-2
            w-72
            sm:w-80
            bg-white
            border
            border-slate-200
            shadow-[0_20px_25px_-5px_rgba(0,0,0,0.15)]
            rounded-2xl
            overflow-hidden
          "
        >
          <div className="p-3 sm:p-4 border-b border-slate-200 bg-slate-50">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-[#EA4335] rounded-full flex items-center justify-center flex-shrink-0">
                <GmailIconSimple />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-black">Connect2EdTech</p>
                <p className="text-[10px] sm:text-xs text-black/60">How can we help you?</p>
              </div>
            </div>
          </div>

          <div className="p-1.5 sm:p-2">
            {OPTIONS.map((opt) => (
              <motion.button
                key={opt.label}
                type="button"
                whileHover={shouldReduceMotion ? undefined : { backgroundColor: 'rgba(240,36,122,0.06)' }}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                transition={{ duration: 0.15, ease: EASE }}
                onClick={() => handleOpenGmail(opt.subject, opt.message)}
                className="
                  w-full
                  text-left
                  px-3
                  sm:px-4
                  py-2
                  sm:py-2.5
                  rounded-lg
                  text-xs
                  sm:text-sm
                  font-medium
                  text-black/80
                  hover:text-black
                  hover:bg-pink/5
                  focus:outline-none
                  focus-visible:bg-pink/10
                  transition-colors
                  duration-150
                "
              >
                {opt.label}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* ============================================================ */}
      {/* TOOLTIP                                                     */}
      {/* ============================================================ */}
      <div
        className="
          pointer-events-none
          absolute
          right-full
          top-1/2
          -translate-y-1/2
          mr-3
          hidden
          sm:block
          whitespace-nowrap
          rounded-lg
          bg-white
          px-3
          py-2
          text-xs
          font-semibold
          text-black
          shadow-[4px_4px_12px_rgba(0,0,0,0.15)]
          opacity-0
          translate-x-2
          transition-all
          duration-200
          group-hover:opacity-100
          group-hover:translate-x-0
          group-focus-within:opacity-100
          group-focus-within:translate-x-0
        "
      >
        Chat with us
      </div>

      {/* ============================================================ */}
      {/* GMAIL FLOATING BUTTON                                          */}
      {/* ============================================================ */}
      <motion.button
        ref={buttonRef}
        type="button"
        aria-label="Chat with us on Gmail"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((v) => !v)}
        initial={
          shouldReduceMotion
            ? { opacity: 1 }
            : { opacity: 0, y: 20 }
        }
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: shouldReduceMotion ? 0 : 0.5,
          ease: EASE,
        }}
        whileHover={
          shouldReduceMotion
            ? undefined
            : { scale: 1.08 }
        }
        whileTap={
          shouldReduceMotion
            ? undefined
            : { scale: 0.95 }
        }
        className="
          group
          relative
          flex
          items-center
          justify-center
          flex-shrink-0
          w-12
          h-12
          sm:w-14
          sm:h-14
          rounded-full
          bg-[#EA4335]
          text-white
          shadow-[5px_5px_14px_rgba(0,0,0,0.2)]
          transition-shadow
          duration-200
          hover:bg-[#C5221F]
          hover:shadow-[7px_7px_18px_rgba(0,0,0,0.24)]
          focus:outline-none
          focus-visible:ring-2
          focus-visible:ring-[#EA4335]
          focus-visible:ring-offset-2
          focus-visible:ring-offset-white
        "
      >
        {!shouldReduceMotion && (
          <motion.span
            aria-hidden="true"
            className="
              absolute
              inset-0
              rounded-full
              border-2
              border-[#EA4335]
            "
            initial={{ scale: 1, opacity: 0.7 }}
            animate={{
              scale: [1, 1.25, 1.4],
              opacity: [0.6, 0.2, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeOut',
            }}
          />
        )}

        <GmailIconSimple />
      </motion.button>
    </div>
  )
}

export default GmailChat
