import { motion } from 'framer-motion'
import SocialIcon from '../../common/SocialIcon.jsx'
import { EASE, iconPop } from '../../../utils/animationVariants'

function MentorCard({ image, name, designation, socialLinks = [], index = 0, showSocials = false }) {
  return (
    <div className="flex-1 min-w-0">
      <motion.div
        whileHover={{ y: -8, scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.35, ease: EASE }}
        className="mentor-card group relative rounded-[1.25rem] sm:rounded-[1.5rem] bg-white border border-slate-100 shadow-sm p-5 sm:p-6 md:p-7 flex flex-col items-center text-center gap-3 sm:gap-4 md:gap-5 h-full min-h-[20rem] md:min-h-[24rem]"
        style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}
      >
        <style>{`
          @media (hover: hover) {
            .mentor-card:hover {
              box-shadow: 0 18px 38px -16px rgba(0, 0, 0, 0.16), 0 0 0 1px rgba(0,0,0,0.03);
            }
            .mentor-card:hover .mentor-image {
              transform: scale(1.05);
            }
            .mentor-card:hover .mentor-ring-glow {
              opacity: 1;
              animation: mentor-ring-spin 4.5s linear infinite;
            }
            .mentor-card:hover .mentor-dot {
              animation: mentor-dot-pulse 1.6s ease-out infinite;
            }
            .mentor-card:hover .mentor-socials {
              opacity: 1;
              transform: translateY(0);
            }
          }

          /* Shared, identical sizing for both mentor images */
          .mentor-image {
            width: 100%;
            height: 100%;
            aspect-ratio: 1 / 1;
            border-radius: 50%;
            object-fit: cover;
            object-position: center;
            display: block;
            transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
          }

          /* Rotating / glowing ring around the image (desktop hover only) */
          .mentor-ring-glow {
            opacity: 0;
            padding: 3px;
            background: conic-gradient(
              from 0deg,
              transparent 0deg,
              rgba(240, 36, 122, 0.75) 70deg,
              transparent 150deg,
              transparent 360deg
            );
            -webkit-mask:
              linear-gradient(#000 0 0) content-box,
              linear-gradient(#000 0 0);
            -webkit-mask-composite: xor;
            mask-composite: exclude;
            box-shadow: 0 0 14px 2px rgba(240, 36, 122, 0.25);
            transition: opacity 0.45s ease;
            pointer-events: none;
          }

          .mentor-socials {
            opacity: 0;
            transform: translateY(8px);
            transition: opacity 0.35s ease-out, transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
          }

          @media (max-width: 767px) {
            .mentor-socials {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes mentor-ring-spin {
            to { transform: rotate(360deg); }
          }

          @keyframes mentor-dot-pulse {
            0%   { box-shadow: 0 0 0 0 rgba(240, 36, 122, 0.45); }
            70%  { box-shadow: 0 0 0 8px rgba(240, 36, 122, 0); }
            100% { box-shadow: 0 0 0 0 rgba(240, 36, 122, 0); }
          }

          @media (prefers-reduced-motion: reduce) {
            .mentor-ring-glow,
            .mentor-dot {
              animation: none !important;
            }
          }
        `}</style>

        <div className="relative flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32">
          <span className="mentor-ring-glow absolute inset-0 rounded-full" aria-hidden="true" />

          <motion.div
            className="mentor-ring relative w-full h-full rounded-full bg-slate-50 border border-slate-200 p-1 sm:p-1.5 md:p-2"
            initial={{ scale: 0.85, rotate: -3, opacity: 0 }}
            whileInView={{ scale: 1, rotate: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.15 + index * 0.12 }}
          >
            {image && (
              <img src={image} alt={name} className="mentor-image" />
            )}
          </motion.div>

          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 + index * 0.12, duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
            className="mentor-dot absolute bottom-0.5 right-0.5 w-3 h-3 sm:w-4 sm:h-4 md:w-4 md:h-4 rounded-full bg-pink border-2 border-white"
          />
        </div>

        <div className="mentor-text min-w-0 px-1">
          <motion.h3
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.35 + index * 0.12, duration: 0.5, ease: EASE }}
            className="text-black text-sm sm:text-base md:text-lg font-bold tracking-tight truncate"
          >
            {name}
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.45 + index * 0.12, duration: 0.5, ease: EASE }}
            className="text-slate-500 text-xs sm:text-sm md:text-base line-clamp-2 leading-relaxed font-medium tracking-wide"
          >
            {designation}
          </motion.p>
        </div>

        {showSocials && socialLinks.length > 0 && (
          <div className="mentor-socials flex items-center justify-center gap-2 sm:gap-2.5 h-8">
            {socialLinks.map((link, i) => (
              <motion.div
                key={link.platform + i}
                custom={i}
                variants={iconPop}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                whileHover={{ scale: 1.18, rotate: -6 }}
                whileTap={{ scale: 0.9 }}
              >
                <SocialIcon platform={link.platform} url={link.url} label={link.platform} size="sm" />
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default MentorCard
