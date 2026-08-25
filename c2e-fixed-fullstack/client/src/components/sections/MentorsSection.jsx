import SectionHeading from '../common/SectionHeading.jsx'
import { motion } from 'framer-motion'
import MentorCard from './cards/MentorCard.jsx'
import vikasImage from '../../assets/images/vikas-gowda.png'
import karthikImage from '../../assets/images/karthik-gowda.png'
import { whatsappUrl, CONTACT } from '../../constants/contacts.js'
import { fadeUp, mentorCardReveal } from '../../utils/animationVariants'

const MENTORS = [
  {
    image: vikasImage,
    name: 'Vikas Gowda',
    designation: 'CEO of Connect2Future',
    socialLinks: [
      { platform: 'github', url: '#' },
      { platform: 'linkedin', url: '#' },
      { platform: 'mail', url: `mailto:${CONTACT.email}` },
      { platform: 'whatsapp', url: whatsappUrl() },
    ],
  },
  {
    image: karthikImage,
    name: 'Karthik Gowda',
    designation: 'Managing Director of Connect2Future',
    socialLinks: [
      { platform: 'linkedin', url: '#' },
      { platform: 'mail', url: `mailto:${CONTACT.email}` },
      { platform: 'phone', url: `tel:${CONTACT.phone}` },
    ],
  },
]

function MentorsSection({ showHeading = true, showSocials = false }) {
  return (
      <motion.section
        id="mentors"
        className="w-full px-4 sm:px-6 md:px-8 lg:px-12 py-10 sm:py-14 md:py-18 lg:py-24"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.15,
              delayChildren: 0.1,
            },
          },
        }}
      >
      {showHeading && (
        <motion.div variants={fadeUp} className="flex flex-col">
          <SectionHeading title="MEET OUR MENTORS" align="left" className="mb-6 sm:mb-8 md:mb-10" />
        </motion.div>
      )}
      <motion.div
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.12,
              delayChildren: 0.2,
            },
          },
        }}
        className="flex flex-col md:flex-row items-stretch justify-center gap-4 sm:gap-5 md:gap-6 lg:gap-8 max-w-3xl mx-auto"
      >
        {MENTORS.map((mentor, i) => (
          <motion.div key={mentor.name} variants={mentorCardReveal} custom={i}>
            <MentorCard {...mentor} index={i} showSocials={showSocials} />
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  )
}

export default MentorsSection

