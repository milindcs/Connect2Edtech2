import { motion } from 'framer-motion'
import PageShell from '../components/layout/PageShell.jsx'
import ContactForm from '../components/common/ContactForm.jsx'
import SocialIcon from '../components/common/SocialIcon.jsx'
import { CONTACT, SOCIAL } from '../constants/contacts.js'
import { fadeUp } from '../utils/animationVariants'

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

function ContactPage() {
  return (
    <PageShell showSharedSections={false}>
      <motion.div
        className="w-full pb-16 sm:pb-20 font-sans"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.12,
              delayChildren: 0.1,
            },
          },
        }}
      >
        <motion.div variants={fadeUp} className="w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10 max-w-7xl mx-auto">
            {/* Contact Info + Google Maps */}
            <div className="space-y-4 sm:space-y-6">
              {/* Quick contact methods */}
              <div className="space-y-2 sm:space-y-3">
                {contactItems.map((item) => (
                  <motion.div
                    key={item.label}
                    variants={fadeUp}
                    className="flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 bg-white border border-slate-100 shadow-sm rounded-xl"
                  >
                    <SocialIcon
                      platform={item.icon}
                      url={item.href}
                      label={item.label}
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

              {/* Google Maps */}
              <motion.div variants={fadeUp} className="bg-white border border-slate-100 shadow-sm rounded-xl overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3725.2614029862817!2d76.6060931!3d12.3097425!2m3!1f0!2f0!3f0!3m2!1i1024!2i1024!4f13.1!3m3!1m2!1s0x8d5f4a2084adbec9%3A0xf4fcf3522495b959!2sconnect2future!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                  width="100%"
                  height="200"
                  style={{ border: 0, minHeight: '180px' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Connect2EdTech Location"
                  className="w-full"
                />
              </motion.div>
            </div>

            {/* Contact Form */}
            <motion.div variants={fadeUp}>
              <ContactForm />
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </PageShell>
  )
}

export default ContactPage

