import { useEffect, useMemo, useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, Expand } from 'lucide-react'
import SectionHeading from '../common/SectionHeading.jsx'
import { fadeUp } from '../../utils/animationVariants'

// Direct imports so Vite can reliably resolve and emit these assets.
import img1 from '../../assets/images/moments/01-IMG-20260616-WA0037.jpg'
import img2 from '../../assets/images/moments/02-IMG-20260616-WA0038.jpg'
import img3 from '../../assets/images/moments/03-WhatsApp Image 2026-08-13 at 12.11.05 PM.jpeg'

const CAPTIONS = {
  '01-IMG-20260616-WA0037.jpg': 'Mentor-led classroom session',
  '02-IMG-20260616-WA0038.jpg': 'Student group mentoring moment',
  '03-WhatsApp Image 2026-08-13 at 12.11.05 PM.jpeg': 'Team meetup at Connect2EdTech',
}

const IMAGES = [
  { src: img1, alt: CAPTIONS['01-IMG-20260616-WA0037.jpg'] || 'Connect2EdTech moment 1' },
  { src: img2, alt: CAPTIONS['02-IMG-20260616-WA0038.jpg'] || 'Connect2EdTech moment 2' },
  { src: img3, alt: CAPTIONS['03-WhatsApp Image 2026-08-13 at 12.11.05 PM.jpeg'] || 'Connect2EdTech moment 3' },
]

// -------------------------------------------------------------------------
// GALLERY CARD
// -------------------------------------------------------------------------

function GalleryCard({ image, index, onOpen }) {
  return (
    <motion.button
      type="button"
      onClick={() => onOpen(index)}
      className="group relative w-full overflow-hidden rounded-xl bg-white border border-slate-100 shadow-sm text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-pink aspect-[3/2] lg:aspect-[4/3]"
      aria-label={`Open image: ${image.alt}`}
    >
      <img
        src={image.src}
        alt={image.alt}
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
      />

      {/* Subtle hover overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-black/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Expand icon, fades in on hover */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-black shadow-md">
          <Expand size={20} strokeWidth={2} />
        </span>
      </div>
    </motion.button>
  )
}

// -------------------------------------------------------------------------
// LIGHTBOX
// -------------------------------------------------------------------------

function Lightbox({ images, activeIndex, onClose, onPrev, onNext }) {
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    window.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [onClose, onPrev, onNext])

  const image = images[activeIndex]
  if (!image) return null

  return (
    <AnimatePresence>
      <motion.div
        key="lightbox-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm px-4 py-8 sm:px-10"
        onClick={onClose}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close preview"
          className="absolute right-4 top-4 sm:right-6 sm:top-6 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
        >
          <X size={20} />
        </button>

        {/* Prev button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onPrev()
          }}
          aria-label="Previous image"
          className="absolute left-2 sm:left-6 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
        >
          <ChevronLeft size={22} />
        </button>

        {/* Next button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onNext()
          }}
          aria-label="Next image"
          className="absolute right-2 sm:right-6 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
        >
          <ChevronRight size={22} />
        </button>

        <motion.img
          key={image.src}
          src={image.src}
          alt={image.alt}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="max-h-[80vh] max-w-full rounded-lg object-contain shadow-2xl sm:max-w-[85vw]"
        />

        {/* Caption + position indicator */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute bottom-4 left-1/2 w-full max-w-md -translate-x-1/2 px-4 text-center"
        >
          <p className="text-sm text-white/90">{image.alt}</p>
          <p className="mt-1 text-xs uppercase tracking-widest text-white/50">
            {activeIndex + 1} / {images.length}
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

// -------------------------------------------------------------------------
// SECTION
// -------------------------------------------------------------------------

function ImpactImagesSection() {
  const [activeIndex, setActiveIndex] = useState(null)
  const [paused, setPaused] = useState(false)
  const images = useMemo(() => IMAGES, [])
  const duplicatedImages = useMemo(() => [...images, ...images], [images])

  const openAt = useCallback((index) => setActiveIndex(index), [])
  const close = useCallback(() => setActiveIndex(null), [])
  const prev = useCallback(
    () => setActiveIndex((i) => (i === null ? i : (i - 1 + images.length) % images.length)),
    [images.length]
  )
  const next = useCallback(
    () => setActiveIndex((i) => (i === null ? i : (i + 1) % images.length)),
    [images.length]
  )

  return (
    <motion.section
      className="w-full px-5 sm:px-8 md:px-12 py-16 sm:py-20 md:py-24 lg:py-32"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1,
          },
        },
      }}
    >
      <motion.div variants={fadeUp} className="flex flex-col max-w-7xl mx-auto px-5 sm:px-8 md:px-12">
        <SectionHeading
          title="Moments In Action"
          subtitle="Snapshots from our sessions, mentor meetups, and student milestones."
          align="left"
          className="mb-10 sm:mb-12 md:mb-14"
        />
      </motion.div>

      <motion.div
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.08,
              delayChildren: 0.2,
            },
          },
        }}
        className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12"
      >
        <div
          className="overflow-hidden"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div
            className="flex gap-6 sm:gap-8 md:gap-10"
            style={{
              width: 'max-content',
              animation: paused ? 'none' : 'carouselScroll 20s linear infinite',
            }}
          >
            {duplicatedImages.map((image, i) => (
              <motion.div
                key={`${image.src}-${i}`}
                variants={fadeUp}
                custom={i % images.length}
                className="snap-start flex-shrink-0 w-[85vw] sm:w-[60vw] md:w-[45vw] lg:w-[38vw]"
              >
                <GalleryCard image={image} index={i % images.length} onOpen={openAt} />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {activeIndex !== null && (
        <Lightbox
          images={images}
          activeIndex={activeIndex}
          onClose={close}
          onPrev={prev}
          onNext={next}
        />
      )}
    </motion.section>
  )
}

export default ImpactImagesSection
