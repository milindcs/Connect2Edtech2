import { AnimatePresence, motion } from 'framer-motion'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { toAbsoluteUrl } from '../../../utils/toAbsoluteUrl.js'

// Full-screen lightbox for the About page gallery. Kept in the same visual
// language as MobileMenu (full-screen overlay, rounded black close button).
function GalleryLightbox({ items, activeIndex, onClose, onPrev, onNext }) {
  const active = activeIndex != null ? items[activeIndex] : null

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center px-4 py-8"
          onClick={onClose}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close gallery"
            className="absolute top-5 right-5 sm:top-8 sm:right-8 w-10 h-10 rounded-full bg-black flex items-center justify-center border border-white/20 hover:border-white/50 transition-colors"
          >
            <X size={18} color="#fff" strokeWidth={2.2} />
          </button>

          {items.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onPrev()
                }}
                aria-label="Previous image"
                className="absolute left-3 sm:left-8 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black flex items-center justify-center border border-white/20 hover:border-white/50 transition-colors"
              >
                <ChevronLeft size={20} color="#fff" strokeWidth={2.2} />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onNext()
                }}
                aria-label="Next image"
                className="absolute right-3 sm:right-8 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black flex items-center justify-center border border-white/20 hover:border-white/50 transition-colors"
              >
                <ChevronRight size={20} color="#fff" strokeWidth={2.2} />
              </button>
            </>
          )}

          <motion.div
            key={active._id}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="max-w-4xl w-full flex flex-col items-center gap-4"
          >
            <img
              src={toAbsoluteUrl(active.image)}
              alt={active.title}
              className="max-h-[75vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl"
            />
            <div className="text-center px-4">
              <h3 className="text-white text-sm sm:text-base font-semibold">{active.title}</h3>
              {active.description && (
                <p className="text-white/60 text-xs sm:text-sm mt-1 max-w-lg mx-auto">{active.description}</p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default GalleryLightbox
