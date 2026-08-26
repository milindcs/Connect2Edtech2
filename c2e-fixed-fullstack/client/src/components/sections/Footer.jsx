import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import SocialIcon from '../common/SocialIcon.jsx'
import { NAV_LINKS } from '../common/Navbar.jsx'
import { whatsappUrl, CONTACT, SOCIAL } from '../../constants/contacts.js'
import logo from '../../assets/cc2e.png'
import { fadeUp } from '../../utils/animationVariants'

// Contact buttons rendered in the footer — uses the centralized CONTACT
// constant so the number/email never drift from the WhatsAppChat link.

// Section 6.9 rewrite. Layout is modelled on the client-provided reference
// footer (contact column / collaborate CTA / address-style column, quick
// links, socials, big closing line) but re-themed onto the site's own white
// background + black/pink palette instead of the reference's neon-green one,
// and re-populated with Connect2EdTech's real content per the latest brief.
const SOCIALS = [
  { platform: 'phone', url: `tel:${CONTACT.phone}`, label: 'Phone' },
  { platform: 'googleMaps', url: SOCIAL.googleMaps, label: 'Find us on Google Maps', target: true },
  { platform: 'mail', url: `mailto:${CONTACT.email}`, label: 'Gmail' },
  { platform: 'whatsapp', url: whatsappUrl(), label: 'WhatsApp' },
  { platform: 'linkedin', url: SOCIAL.linkedin, label: 'LinkedIn' },
  { platform: 'instagram', url: SOCIAL.instagram, label: 'Instagram' },
  { platform: 'github', url: SOCIAL.github, label: 'GitHub' },
]

// Quick links are pulled straight from the navbar so the footer never drifts
// out of sync with the site's real navigation.
const QUICK_LINKS = NAV_LINKS.filter((l) =>
  ['About', 'Courses', 'Mentors', 'Become a Trainer', 'Contact Us'].includes(l.label)
)

function Footer() {
  return (
    <motion.footer
      className="w-full bg-white text-black border-t border-gray-border px-4 sm:px-6 md:px-8 pt-5 sm:pt-6 md:pt-8 pb-16 sm:pb-6"
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
      <motion.div variants={fadeUp} className="flex flex-col md:flex-row md:justify-between gap-5 sm:gap-6 md:gap-8 max-w-7xl mx-auto">
        {/* Left column: brand + tagline + socials */}
        <div className="flex flex-col gap-1.5 sm:gap-2 max-w-xs">
          <Link to="/" className="flex items-center gap-1 sm:gap-1.5" aria-label="Connect2EdTech Home">
            <img src={logo} alt="Connect2EdTech Logo" className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 object-contain flex-shrink-0" />
            <span className="font-gilroy text-[10px] sm:text-[11px] md:text-xs lg:text-sm font-bold tracking-tight text-black leading-tight">
              Connect2EdTech
            </span>
          </Link>
          <h3 className="text-black leading-snug text-xs sm:text-sm md:text-base" style={{ fontSize: 'clamp(0.8rem, 1.1vw, 1.1rem)' }}>
            Crafting the future
            <br />
            of education
          </h3>
          <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
          {SOCIALS.map(({ platform, url, label, target }) => (
            <SocialIcon key={label} platform={platform} url={url} label={label} size="sm" target={target} />
          ))}
          </div>

        </div>

        {/* Right column: quick links pulled from the navbar */}
        <motion.div variants={fadeUp} className="flex flex-col items-start md:items-end gap-1 sm:gap-1.5 text-left md:text-right">
          <h4 className="text-[9px] sm:text-[10px] uppercase tracking-wider text-black mb-0.5">Quick Links</h4>
          {QUICK_LINKS.map(({ label, to }) => (
            <Link
              key={label}
              to={to}
              className="text-[9px] sm:text-[10px] md:text-xs text-black/70 hover:text-pink transition-colors duration-200"
            >
              {label}
            </Link>
          ))}
          <Link
            to="/admin/login"
            className="text-[9px] sm:text-[10px] md:text-xs text-black/70 hover:text-pink transition-colors duration-200"
          >
            Admin Login
          </Link>
        </motion.div>
      </motion.div>

      {/* Big closing line */}
      <motion.div variants={fadeUp} className="mt-4 sm:mt-5 md:mt-6 overflow-hidden text-center">
        <p
          className="uppercase text-black leading-none whitespace-nowrap inline-block"
          style={{ fontSize: 'clamp(0.875rem, 4.5vw, 3.5rem)', fontWeight: 900 }}
        >
          Connect2<span className="text-black">EdTech</span>
        </p>
      </motion.div>

      <motion.div variants={fadeUp} className="mt-3 sm:mt-4 md:mt-6 pt-3 sm:pt-4 border-t border-gray-border text-center">
        <p className="text-[8px] sm:text-[9px] md:text-[10px] text-black/50">
          © 2026 Connect2EdTech. All rights reserved.
        </p>
      </motion.div>
    </motion.footer>
  )
}

export default Footer
