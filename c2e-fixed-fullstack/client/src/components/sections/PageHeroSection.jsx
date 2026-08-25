import { motion } from 'framer-motion'
import { fadeUp, fadeDown } from '../../utils/animationVariants'

function PageHeroSection({ eyebrow, title, subtitle, videoSrc, children, className = '' }) {
  return (
    <section className={`relative w-full h-[70vh] sm:h-[65vh] min-h-[500px] overflow-hidden flex items-end justify-end px-6 sm:px-12 lg:px-20 pt-8 pb-12 ${className}`}>
      {videoSrc && (
        <>
          {/* Background Video Layer */}
          <div className="absolute inset-0 w-full h-full z-0 pointer-events-none overflow-hidden">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover scale-105"
            >
              <source src={videoSrc} type="video/mp4" />
            </video>
          </div>

          {/* Ultra-Light Frosted Overlay */}
          <div className="absolute inset-0 z-10 bg-gradient-to-l from-white/25 via-white/10 to-transparent backdrop-blur-[0.5px]" />
        </>
      )}

      {/* Right-Aligned Hero Content with Side-by-Side Bottom Layout */}
      <div className="relative z-20 flex flex-col items-end text-right w-full pt-16 ml-auto max-w-5xl justify-between h-full">
        {/* Top Spacer */}
        <div></div>

        {/* Main Content */}
        <div className="w-full mb-8">
          {eyebrow && (
            <motion.span
              custom={0}
              initial="hidden"
              animate="visible"
              variants={fadeDown}
              className="text-xs sm:text-sm font-semibold uppercase tracking-[0.18em] sm:tracking-[0.22em] text-accent"
            >
              {eyebrow}
            </motion.span>
          )}

          {title && (
            <motion.h1
              custom={1}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="uppercase text-black leading-[1.1] tracking-[0.01em]"
              style={{ fontSize: 'clamp(2.5rem, 5.5vw, 5rem)' }}
            >
              {title}
              <span className="text-accent">.</span>
            </motion.h1>
          )}

          {subtitle && (
            <motion.p
              custom={2}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="text-gray-800 max-w-lg"
              style={{ fontSize: 'clamp(0.9rem, 1.2vw, 1.1rem)', lineHeight: 1.6 }}
            >
              {subtitle}
            </motion.p>
          )}
        </div>

        {/* Bottom Action Buttons */}
        <div className="flex flex-row items-center justify-end gap-3 w-full">
          {children && (
            <motion.div
              custom={3}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="w-full flex flex-row items-center justify-end gap-3"
            >
              {children}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}

export default PageHeroSection
