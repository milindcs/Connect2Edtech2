import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Navbar from '../common/Navbar.jsx'
import MobileMenu from '../common/MobileMenu.jsx'
import Footer from '../sections/Footer.jsx'
import StatsSection from '../common/StatsSection.jsx'
import MissionVisionSection from '../sections/MissionVisionSection.jsx'
import useMenu from '../../hooks/useMenu.js'
import { fadeUp } from '../../utils/animationVariants'
import NeuButton from '../common/NeuButton.jsx'

// Shared shell for non-homepage pages. Keeps Navbar/MobileMenu/Footer
// consistent across the site, but does not render any hero/header.
function PageShell({ topSlot, children, showSharedSections = true }) {
  const menu = useMenu()

  return (
    <div className="relative w-full flex flex-col font-sans bg-white min-h-screen">
      <Navbar onMenuOpen={menu.open} />
      <MobileMenu isOpen={menu.isOpen} onClose={menu.close} />

      {/* Spacer to clear the fixed navbar — everything below this point used
          to render directly under the navbar since only <main> had top
          padding. Moving the offset here so it covers topSlot/back-button/
          shared sections too. */}
      <div className="pt-16 sm:pt-20">
        {topSlot && (
          <motion.div variants={fadeUp} className="w-full px-4 sm:px-6 md:px-8 mb-6 sm:mb-8">
            {topSlot}
          </motion.div>
        )}

        <motion.div variants={fadeUp} className="w-full px-4 sm:px-6 md:px-8 mb-4 sm:mb-6">
          <NeuButton href="/" variant="secondary" className="!w-auto !px-4 !py-2 text-[10px] sm:text-xs">
            ← Back to Home
          </NeuButton>
        </motion.div>

        {showSharedSections && (
          <>
            <motion.div variants={fadeUp} custom={0}>
              <StatsSection />
            </motion.div>
            <motion.div variants={fadeUp} custom={1}>
              <MissionVisionSection />
            </motion.div>
          </>
        )}

        <main className="flex-1 w-full">{children}</main>
      </div>

      <Footer />
    </div>
  )
}

export default PageShell

