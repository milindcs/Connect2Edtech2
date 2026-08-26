import { motion, useReducedMotion } from "framer-motion";
import { CONTACT } from "../../constants/contacts.js";

/* ====================================================================== */
/* GMAIL ENVELOPE ICON                                                     */
/* ====================================================================== */

function GmailIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="relative z-10 w-5 h-5 sm:w-6 sm:h-6 shrink-0"
    >
      <path d="M20 4H4C2.89 4 2 4.89 2 6V8L10.6667 12C11.2333 12.3 12.7667 12.3 13.3333 12L22 8V6C22 4.89 21.1046 4 20 4Z" />
      <path d="M22 12V18C22 19.1046 21.1046 20 20 20H4C2.89 20 2 19.1046 2 18V12L10.6667 15.5C11.2333 15.7 12.7667 15.7 13.3333 15.5L22 12Z" />
    </svg>
  );
}

/* ====================================================================== */
/* GMAIL COMPOSE URL                                                       */
/* ====================================================================== */

const gmailComposeUrl = (subject, body) => {
  const params = new URLSearchParams({
    view: "cm",
    fs: "1",
    to: CONTACT.email,
    su: subject,
    body: body,
  });
  return `https://mail.google.com/mail/?${params.toString()}`;
};

const DEFAULT_SUBJECT = "Connect2EdTech Enquiry";
const DEFAULT_MESSAGE =
  "Hello Connect2EdTech Team,\n\nI would like to know more about your courses and services.\n\nThank you.";

/* ====================================================================== */
/* GMAIL FLOATING CHAT BUTTON                                              */
/* ====================================================================== */

function GmailChat() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      className="
        fixed
        bottom-[80px]
        right-4
        sm:bottom-[92px]
        sm:right-6
        z-[9999]
        group
      "
    >
      {/* ================================================================ */}
      {/* TOOLTIP                                                           */}
      {/* ================================================================ */}
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
        Chat with us on Gmail
      </div>

      {/* ================================================================ */}
      {/* GMAIL BUTTON                                                      */}
      {/* ================================================================ */}
      <motion.a
        href={gmailComposeUrl(DEFAULT_SUBJECT, DEFAULT_MESSAGE)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on Gmail"
        initial={
          shouldReduceMotion
            ? { opacity: 1 }
            : { opacity: 0, y: 20 }
        }
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: shouldReduceMotion ? 0 : 0.5,
          ease: [0.22, 1, 0.36, 1],
        }}
        whileHover={
          shouldReduceMotion
            ? undefined
            : {
                scale: 1.08,
              }
        }
        whileTap={
          shouldReduceMotion
            ? undefined
            : {
                scale: 0.95,
              }
        }
        className="
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
        {/* ============================================================ */}
        {/* PULSE                                                         */}
        {/* ============================================================ */}
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
            initial={{
              scale: 1,
              opacity: 0.7,
            }}
            animate={{
              scale: [1, 1.25, 1.4],
              opacity: [0.6, 0.2, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />
        )}

        {/* ============================================================ */}
        {/* ICON                                                           */}
        {/* ============================================================ */}
        <GmailIcon />
      </motion.a>
    </div>
  );
}

export default GmailChat;
