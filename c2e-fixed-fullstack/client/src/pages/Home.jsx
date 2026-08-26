import { useState } from 'react'
import { motion } from 'framer-motion'
import MainLayout from '../components/layout/MainLayout.jsx'
import Navbar from '../components/common/Navbar.jsx'
import HeroSection from '../components/layout/HeroSection.jsx'
import MobileMenu from '../components/common/MobileMenu.jsx'
import StatsSection from '../components/common/StatsSection.jsx'
import MissionVisionSection from '../components/sections/MissionVisionSection.jsx'
import BottomContent from '../components/common/BottomContent.jsx'
import ReadyToElevateSection from '../components/sections/ReadyToElevateSection.jsx'
import Footer from '../components/sections/Footer.jsx'
import { fadeUp } from '../utils/animationVariants'

function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <MainLayout>
      <Navbar onMenuOpen={() => setIsMenuOpen(true)} />
      <HeroSection />

      <div className="h-16 sm:h-20 md:h-24" />

      <div className="pt-16 sm:pt-20">
        <motion.div variants={fadeUp} custom={0}>
          <StatsSection />
        </motion.div>
        <motion.div variants={fadeUp} custom={1}>
          <MissionVisionSection />
        </motion.div>
        <motion.div variants={fadeUp} custom={2}>
          <BottomContent />
        </motion.div>
        <motion.div variants={fadeUp} custom={3}>
          <ReadyToElevateSection />
        </motion.div>
        <motion.div variants={fadeUp} custom={4}>
          <Footer />
        </motion.div>
      </div>
      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </MainLayout>
  )
}

export default Home


