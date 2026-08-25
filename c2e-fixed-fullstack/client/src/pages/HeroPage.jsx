import { useState } from 'react'
import Navbar from '../components/common/Navbar.jsx'
import HeroSection from '../components/layout/HeroSection.jsx'
import MobileMenu from '../components/common/MobileMenu.jsx'

function HeroPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <>
      <Navbar onMenuOpen={() => setIsMenuOpen(true)} />
      <HeroSection />
      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  )
}

export default HeroPage
