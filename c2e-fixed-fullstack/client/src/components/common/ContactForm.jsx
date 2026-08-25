import { useState } from "react";
import { motion } from "framer-motion";
import {
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import { fadeUp } from "../../utils/animationVariants";
import { submitContact } from "../../services/contact.js";
import NeuButton from "./NeuButton.jsx";


/* ====================================================================== */
/* INITIAL FORM                                                           */
/* ====================================================================== */

const initialForm = {
  name: "",
  email: "",
  phone: "",
  interestedCourse: "",
  message: "",
  website: "",
};


/* ====================================================================== */
/* INPUT STYLES                                                           */
/* ====================================================================== */

const inputClasses = `
  w-full
  rounded-xl
  sm:rounded-2xl
  bg-slate-50
  border
  border-slate-200
  px-3
  py-2.5
  text-sm
  text-black
  placeholder:text-slate-400
  outline-none
  transition-shadow
  focus-visible:ring-2
  focus-visible:ring-accent
  disabled:opacity-60
  disabled:cursor-not-allowed
`;


/* ====================================================================== */
/* CONTACT FORM                                                           */
/* ====================================================================== */

function ContactForm() {
  const [form, setForm] = useState(initialForm);

  const [status, setStatus] = useState("idle");

  const [errorMessage, setErrorMessage] = useState("");

  const isSubmitting = status === "submitting";


  /* ==================================================================== */
  /* HANDLE INPUT                                                         */
  /* ==================================================================== */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    // Remove previous error when user starts correcting the form
    if (status === "error") {
      setStatus("idle");
      setErrorMessage("");
    }
  };


  /* ==================================================================== */
  /* SUBMIT                                                               */
  /* ==================================================================== */

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Prevent duplicate submissions
    if (isSubmitting) {
      return;
    }

    setStatus("submitting");
    setErrorMessage("");


    /* ------------------------------------------------------------------ */
    /* Honeypot                                                           */
    /* ------------------------------------------------------------------ */

    if (form.website.trim() !== "") {
      setStatus("success");
      setForm({ ...initialForm });

      return;
    }


    /* ------------------------------------------------------------------ */
    /* Clean form data                                                    */
    /* ------------------------------------------------------------------ */

    const cleanedForm = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      interestedCourse: form.interestedCourse.trim(),
      message: form.message.trim(),
      website: "",
    };


    /* ------------------------------------------------------------------ */
    /* Basic validation                                                    */
    /* ------------------------------------------------------------------ */

    if (!cleanedForm.name) {
      setStatus("error");
      setErrorMessage("Please enter your name.");
      return;
    }

    if (!cleanedForm.email) {
      setStatus("error");
      setErrorMessage("Please enter your email address.");
      return;
    }

    if (!cleanedForm.phone) {
      setStatus("error");
      setErrorMessage("Please enter your phone number.");
      return;
    }

    if (!cleanedForm.message) {
      setStatus("error");
      setErrorMessage("Please enter your message.");
      return;
    }


    /* ------------------------------------------------------------------ */
    /* Email validation                                                    */
    /* ------------------------------------------------------------------ */

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(cleanedForm.email)) {
      setStatus("error");
      setErrorMessage("Please enter a valid email address.");
      return;
    }


    /* ------------------------------------------------------------------ */
    /* Submit to backend                                                   */
    /* ------------------------------------------------------------------ */

    try {
      await submitContact(cleanedForm);

      setStatus("success");

      setForm({
        ...initialForm,
      });

    } catch (error) {
      console.error("Contact form submission failed:", error);

      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Something went wrong. Please try again in a moment.";

      setStatus("error");
      setErrorMessage(message);
    }
  };


  /* ==================================================================== */
  /* RENDER                                                               */
  /* ==================================================================== */

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial="hidden"
      whileInView="visible"
      viewport={{
        once: true,
        amount: 0.15,
      }}
      custom={1}
      variants={fadeUp}
      noValidate={false}
      aria-label="Contact form"
      className="
        bg-white
        border
        border-slate-100
        shadow-sm
        w-full
        max-w-xl
        mx-auto
        rounded-[1.25rem]
        sm:rounded-[1.5rem]
        md:rounded-[1.75rem]
        p-4
        sm:p-5
        md:p-6
        lg:p-8
        flex
        flex-col
        gap-3
        sm:gap-4
        text-left
      "
    >

      {/* ================================================================ */}
      {/* HONEYPOT                                                         */}
      {/* ================================================================ */}

      <div
        aria-hidden="true"
        className="absolute w-px h-px overflow-hidden opacity-0 pointer-events-none"
      >
        <label htmlFor="website">
          Leave this field empty
        </label>

        <input
          id="website"
          type="text"
          name="website"
          autoComplete="off"
          tabIndex={-1}
          value={form.website}
          onChange={handleChange}
        />
      </div>


      {/* ================================================================ */}
      {/* NAME + EMAIL                                                      */}
      {/* ================================================================ */}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4">

        <div>
          <label
            htmlFor="contact-name"
            className="sr-only"
          >
            Full Name
          </label>

          <input
            id="contact-name"
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            autoComplete="name"
            required
            disabled={isSubmitting}
            className={inputClasses}
          />
        </div>


        <div>
          <label
            htmlFor="contact-email"
            className="sr-only"
          >
            Email Address
          </label>

          <input
            id="contact-email"
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
            required
            disabled={isSubmitting}
            className={inputClasses}
          />
        </div>

      </div>


      {/* ================================================================ */}
      {/* PHONE + COURSE                                                    */}
      {/* ================================================================ */}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4">

        <div>
          <label
            htmlFor="contact-phone"
            className="sr-only"
          >
            Phone Number
          </label>

          <input
            id="contact-phone"
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            autoComplete="tel"
            inputMode="tel"
            required
            disabled={isSubmitting}
            className={inputClasses}
          />
        </div>


        <div>
          <label
            htmlFor="contact-course"
            className="sr-only"
          >
            Interested Course
          </label>

          <input
            id="contact-course"
            type="text"
            name="interestedCourse"
            placeholder="Interested Course (optional)"
            value={form.interestedCourse}
            onChange={handleChange}
            disabled={isSubmitting}
            className={inputClasses}
          />
        </div>

      </div>


      {/* ================================================================ */}
      {/* MESSAGE                                                           */}
      {/* ================================================================ */}

      <div>
        <label
          htmlFor="contact-message"
          className="sr-only"
        >
          Your Message
        </label>

        <textarea
          id="contact-message"
          name="message"
          placeholder="Your Message"
          value={form.message}
          onChange={handleChange}
          required
          rows={5}
          disabled={isSubmitting}
          className={`${inputClasses} resize-none`}
        />
      </div>


      {/* ================================================================ */}
      {/* SUBMIT                                                            */}
      {/* ================================================================ */}

      <div className="flex flex-col items-center gap-3 pt-1">

        <NeuButton
          type="submit"
          variant="primary"
          disabled={isSubmitting}
          className="w-full sm:w-auto min-w-[10rem]"
          aria-disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="inline-flex items-center justify-center gap-2">
              <Loader2
                className="w-4 h-4 animate-spin"
                aria-hidden="true"
              />

              Sending...
            </span>
          ) : (
            "Send Message"
          )}
        </NeuButton>


        {/* ============================================================ */}
        {/* SUCCESS                                                        */}
        {/* ============================================================ */}

        {status === "success" && (
          <motion.p
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            role="status"
            className="
              flex
              items-center
              gap-1.5
              text-xs
              text-emerald-600
              font-semibold
              text-center
            "
          >
            <CheckCircle2
              className="w-4 h-4 shrink-0"
              aria-hidden="true"
            />

            Thanks! We'll be in touch soon.
          </motion.p>
        )}


        {/* ============================================================ */}
        {/* ERROR                                                          */}
        {/* ============================================================ */}

        {status === "error" && (
          <motion.p
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            role="alert"
            className="
              flex
              items-center
              gap-1.5
              text-xs
              text-red-500
              font-semibold
              text-center
            "
          >
            <AlertCircle
              className="w-4 h-4 shrink-0"
              aria-hidden="true"
            />

            {errorMessage}
          </motion.p>
        )}

      </div>

    </motion.form>
  );
}


export default ContactForm;
