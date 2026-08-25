import Navbar from '../components/common/Navbar.jsx'
import MobileMenu from '../components/common/MobileMenu.jsx'
import Footer from '../components/sections/Footer.jsx'
import useMenu from '../hooks/useMenu.js'
import OurStorySection from '../components/sections/OurStorySection.jsx'
import MissionVisionSection from '../components/sections/MissionVisionSection.jsx'
import AboutWhyChooseSection from '../components/sections/AboutWhyChooseSection.jsx'
import StatsSection from '../components/common/StatsSection.jsx'
import NeuButton from '../components/common/NeuButton.jsx'
import { motion } from 'framer-motion'
import {
  aboutNavReveal,
  aboutBackReveal,
  aboutStatsReveal,
  aboutStoryReveal,
  aboutMissionReveal,
  aboutWhyReveal,
  aboutFooterReveal,
} from '../utils/animationVariants'

function About() {
  const menu = useMenu()

  return (
    <div className="relative w-full flex flex-col font-sans bg-white min-h-screen">
      {/* Navbar */}
      <div className="w-full">
        <Navbar onMenuOpen={menu.open} />
        <MobileMenu isOpen={menu.isOpen} onClose={menu.close} />
      </div>

      <main className="flex-1 w-full pt-16 sm:pt-20">
        {/* Back button */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={aboutBackReveal}
          className="w-full px-4 sm:px-6 md:px-8 mb-4 sm:mb-6"
        >
          <NeuButton href="/" variant="secondary" className="!w-auto !px-4 !py-2 text-[10px] sm:text-xs">
            ← Back to Home
          </NeuButton>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={aboutStatsReveal}
          className="w-full"
        >
          <StatsSection />
        </motion.div>

        {/* Our Story */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={aboutStoryReveal}
          className="w-full"
        >
          <OurStorySection />
        </motion.div>

        {/* Mission Vision */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={aboutMissionReveal}
          className="w-full"
        >
          <MissionVisionSection />
        </motion.div>

        {/* Why Choose */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={aboutWhyReveal}
          className="w-full"
        >
          <AboutWhyChooseSection />
        </motion.div>
      </main>

      {/* Footer */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={aboutFooterReveal}
        className="w-full"
      >
        <Footer />
      </motion.div>
    </div>
  )
}

export default About


