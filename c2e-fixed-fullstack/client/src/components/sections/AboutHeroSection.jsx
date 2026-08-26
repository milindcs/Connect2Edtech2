import { motion } from 'framer-motion'
import PageHeroSection from './PageHeroSection.jsx'

function AboutHeroSection() {
  return (
    <PageHeroSection
      eyebrow="About Us"
      title="Connecting Minds To Infinite Opportunities"
      subtitle="Connect2Edtech is a skills and mentorship platform built to bridge the gap between learning and industry. We bring together expert mentors, practical curriculum, and real placement support to help learners turn ambition into a career."
      videoSrc="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260517_222138_3e3205be-3364-417b-a64a-bfe087acbec4.mp4"
    >
      <motion.a
        href="/courses"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-[#E62E7B] text-white font-semibold shadow-md hover:bg-[#d0246d] transition-all duration-300 text-sm tracking-wide min-w-[160px] text-center"
      >
        Explore Courses
      </motion.a>
      <motion.a
         href="/trainer-application"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-black text-white font-semibold shadow-md hover:bg-neutral-800 transition-all duration-300 text-sm tracking-wide min-w-[160px] text-center"
      >
        Become a Trainer
      </motion.a>
    </PageHeroSection>
  )
}

export default AboutHeroSection
