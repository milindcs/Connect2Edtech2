import { motion } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { fadeUp } from '../../utils/animationVariants'

function HeroSection() {
  const videoRef = useRef(null)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {})
    }
  }, [])

  return (
    <section
      className="relative w-full h-[calc(100vh-112px)] sm:h-[calc(100vh-128px)] min-h-[440px] overflow-hidden flex items-center px-4 sm:px-6 md:px-8 mt-[112px] sm:mt-[128px] pb-10"
    >

      {/* Background Video Layer */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none overflow-hidden">
        <video
          ref={videoRef}
          className="w-full h-full object-cover scale-105"
          autoPlay
          loop
          muted
          playsInline
          webkit-playsinline="true"
          preload="auto"
        >
          <source
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260517_222138_3e3205be-3364-417b-a64a-bfe087acbec4.mp4"
            type="video/mp4"
          />
        </video>
      </div>

      {/* Ultra-Light Frosted Overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-l from-white/25 via-white/10 to-transparent backdrop-blur-[0.5px]" />

      {/* Right-Aligned Hero Content */}
      <div className="relative z-20 flex flex-col items-end text-right w-full ml-auto max-w-5xl justify-center h-full">
        {/* Main Heading */}
        <div className="w-full mb-8">
          <motion.h1
            custom={6}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="text-black font-extrabold tracking-tight leading-none text-right drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)] whitespace-nowrap"
            style={{ fontSize: 'clamp(2rem, 4.5vw, 4rem)' }}
          >
            ELEVATE<br />
            YOUR<br />
            SKILLS
          </motion.h1>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-row items-center justify-end gap-3 w-full">
          <motion.div
            custom={7}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="w-full flex flex-row items-center justify-end gap-3"
          >
            <a
              href="/courses"
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-[#E62E7B] text-white font-semibold shadow-md hover:bg-[#d0246d] transition-all duration-300 text-sm tracking-wide min-w-[160px] text-center"
            >
              VIEW COURSES
            </a>

            <a
              href="#contact"
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-black text-white font-semibold shadow-md hover:bg-neutral-800 transition-all duration-300 text-sm tracking-wide min-w-[160px] text-center"
            >
              CONTACT US
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
