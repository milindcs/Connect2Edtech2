import { motion } from 'framer-motion'
import PageShell from '../components/layout/PageShell.jsx'
import MentorsSection from '../components/sections/MentorsSection.jsx'
import NeuButton from '../components/common/NeuButton.jsx'
import { fadeUp, scaleIn } from '../utils/animationVariants'

function Mentors() {
  return (
    <PageShell showSharedSections={false}>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pb-16 sm:pb-20 flex flex-col gap-10 sm:gap-12">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={scaleIn}
          className="text-center"
        >
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={fadeUp}
            className="w-full uppercase font-bold text-black leading-[1.1] tracking-[0.015em] text-center"
            style={{ fontSize: "clamp(1.25rem, 2.2vw, 1.75rem)" }}
          >
            MEET OUR MENTORS
            <span className="text-[#F0247A]" aria-hidden="true">.</span>
          </motion.h2>
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={fadeUp}
            custom={1}
            className="w-full max-w-xl mx-auto text-black/75 font-medium leading-relaxed tracking-wide text-center mt-2 sm:mt-3"
            style={{ fontSize: "clamp(0.8rem, 1vw, 0.9rem)", lineHeight: 1.6 }}
          >
            Learn from industry experts who are passionate about shaping the next generation of professionals.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={fadeUp}
          custom={0}
        >
          <MentorsSection showHeading={false} showSocials={true} />
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={fadeUp}
          custom={1}
          className="flex flex-col items-center gap-3 pt-2"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.2, ease: 'easeOut' }}>
            <NeuButton href="/mentor-application" variant="primary" className="w-full sm:w-auto min-w-[12rem]">
              Become a Mentor
            </NeuButton>
          </motion.div>
          <p className="text-[10px] sm:text-xs text-gray-muted text-center">
            Interested in mentoring? Apply now and help us shape future leaders.
          </p>
        </motion.div>
      </div>
    </PageShell>
  )
}

export default Mentors


