import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Loader2, ImageOff, AlertTriangle } from 'lucide-react'
import { fadeUp } from '../../utils/animationVariants'
import { getGalleryImages } from '../../services/gallery.js'
import { toAbsoluteUrl } from '../../utils/toAbsoluteUrl.js'
import SectionHeading from '../common/SectionHeading.jsx'
import GalleryLightbox from './cards/GalleryLightbox.jsx'

// Photo gallery for the About page. Images are always fetched from the
// backend (never hardcoded) so newly-uploaded admin images appear here
// automatically. Masonry layout via CSS columns keeps varying image
// aspect ratios looking intentional instead of cropped into uniform tiles.
function GallerySection() {
  const [images, setImages] = useState([])
  const [status, setStatus] = useState('loading') // loading | success | error
  const [activeIndex, setActiveIndex] = useState(null)

  const loadImages = useCallback(() => {
    setStatus('loading')
    getGalleryImages()
      .then((res) => {
        setImages(res.data || [])
        setStatus('success')
      })
      .catch(() => setStatus('error'))
  }, [])

  useEffect(() => {
    loadImages()
  }, [loadImages])

  const openAt = (index) => setActiveIndex(index)
  const close = () => setActiveIndex(null)
  const prev = () => setActiveIndex((i) => (i - 1 + images.length) % images.length)
  const next = () => setActiveIndex((i) => (i + 1) % images.length)

  return (
    <section className="w-full px-5 sm:px-8 md:px-12 py-10 sm:py-14 md:py-20">
      <SectionHeading
        title="Photo Gallery"
        subtitle="Moments from our sessions, mentor meetups, and student milestones."
        align="left"
        className="mb-10 sm:mb-12 md:mb-14"
      />

      {status === 'loading' && (
        <div className="flex flex-col items-center justify-center gap-3 py-16">
          <Loader2 className="w-6 h-6 animate-spin text-accent" />
          <p className="text-sm text-gray-muted">Loading gallery…</p>
        </div>
      )}

      {status === 'error' && (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <span className="w-12 h-12 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-pink" strokeWidth={1.8} />
          </span>
          <p className="text-sm text-slate-500 font-medium">Could not load the gallery right now.</p>
          <button
            onClick={loadImages}
            className="text-xs font-semibold uppercase tracking-widest text-accent hover:opacity-80 transition-opacity"
          >
            Try Again
          </button>
        </div>
      )}

      {status === 'success' && images.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <span className="w-12 h-12 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center">
            <ImageOff className="w-5 h-5 text-slate-400" strokeWidth={1.8} />
          </span>
          <p className="text-sm text-slate-500 font-medium">No gallery photos yet — check back soon.</p>
        </div>
      )}

      {status === 'success' && images.length > 0 && (
        <div className="max-w-6xl mx-auto columns-2 sm:columns-3 lg:columns-4 gap-4 sm:gap-5 [column-fill:_balance]">
          {images.map((item, i) => (
            <motion.button
              type="button"
              key={item._id}
              custom={i % 8}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              onClick={() => openAt(i)}
              className="group relative mb-4 sm:mb-5 w-full break-inside-avoid overflow-hidden rounded-2xl bg-white border border-slate-100 shadow-sm block focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <img
                src={toAbsoluteUrl(item.image)}
                alt={item.title}
                loading="lazy"
                className="w-full h-auto object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <p className="text-white text-xs sm:text-sm font-semibold text-left">{item.title}</p>
              </div>
            </motion.button>
          ))}
        </div>
      )}

      <GalleryLightbox items={images} activeIndex={activeIndex} onClose={close} onPrev={prev} onNext={next} />
    </section>
  )
}

export default GallerySection
