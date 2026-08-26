import SectionHeading from '../common/SectionHeading.jsx'
import ContactForm from '../common/ContactForm.jsx'
import SocialIcon from '../common/SocialIcon.jsx'
import { CONTACT, SOCIAL } from '../../constants/contacts.js'
import { motion } from 'framer-motion'
import { fadeUp } from '../../utils/animationVariants'

const contactItems = [
  {
    icon: 'phone',
    label: 'Phone',
    value: CONTACT.phone,
    href: `tel:${CONTACT.phone}`,
  },
  {
    icon: 'mail',
    label: 'Email',
    value: CONTACT.email,
    href: `mailto:${CONTACT.email}`,
  },
  {
    icon: 'whatsapp',
    label: 'WhatsApp',
    value: `+${CONTACT.whatsappNumber}`,
    href: `https://wa.me/${CONTACT.whatsappNumber}`,
    target: true,
  },
  {
    icon: 'googleMaps',
    label: 'Find us',
    value: 'Connect2EdTech Center',
    href: SOCIAL.googleMaps,
    target: true,
  },
]

function ReadyToElevateSection() {
  return (
    <motion.section
      id="contact"
      className="w-full px-4 sm:px-6 md:px-8 py-10 sm:py-14 md:py-18 lg:py-24"
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
      <motion.div variants={fadeUp} className="flex flex-col items-center lg:items-start text-center lg:text-left gap-4 sm:gap-6 mb-8 sm:mb-10 max-w-7xl mx-auto">
        <SectionHeading
          title="READY TO ELEVATE YOUR FUTURE?"
          subtitle="Join thousands of learners and take the first step towards your dream career today! Send us a message and our team will get back to you."
          align="left"
          className="mb-6 sm:mb-8"
        />
      </motion.div>

      <motion.div variants={fadeUp} className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-7xl mx-auto">
        <div className="space-y-6 sm:space-y-8 lg:text-left">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
            {contactItems.map((item) => (
              <motion.div
                key={item.label}
                variants={fadeUp}
                className="flex items-center gap-3 p-3 sm:p-4 bg-white border border-slate-100 shadow-sm rounded-2xl"
              >
                <SocialIcon
                  platform={item.icon}
                  url={item.href}
                  label={item.label}
                  theme="light"
                  size="sm"
                  target={item.target}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] sm:text-xs uppercase tracking-wider text-slate-500 font-medium">
                    {item.label}
                  </p>
                  <p className="text-xs sm:text-sm font-medium text-slate-900 truncate">
                    {item.value}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="bg-white border border-slate-100 shadow-sm rounded-2xl overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3725.2614029862817!2d76.6060931!3d12.3097425!2m3!1f0!2f0!3f0!3m2!1i1024!2i10!4f13.1!3m3!1m2!1s0x8d5f4a2084adbec9%3A0xf4fcf3522495b959!2sconnect2future!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              width="100%"
              height="200"
              style={{ border: 0, minHeight: '200px' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Connect2EdTech Location"
              className="w-full"
            />
          </div>
        </div>

        <motion.div variants={fadeUp} className="mt-8 sm:mt-10">
          <ContactForm />
        </motion.div>
      </motion.div>
    </motion.section>
  )
}

export default ReadyToElevateSection
