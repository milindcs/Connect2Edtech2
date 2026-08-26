import { motion } from 'framer-motion'

const PARTNERS = [
  'Google', 'Microsoft', 'Amazon', 'TATA', 'Infosys', 'Wipro', 'TCS', 'Accenture',
  'IBM', 'Oracle', 'Intel', 'Cisco', 'Adobe', 'SAP', 'Salesforce', 'Capgemini',
  'Tech Mahindra', 'Deloitte', 'EY', 'KPMG', 'PwC',
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 260,
      damping: 20,
    },
  },
}

function HiringPartnersSection() {
  return (
    <section className="w-full py-12 sm:py-16 md:py-20 lg:py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-3xl mx-auto mb-10 sm:mb-14"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-4"
          >
            OUR HIRING PARTNERS
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed"
          >
            Top companies that trust our graduates.
          </motion.p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="flex flex-wrap justify-center gap-3 sm:gap-4"
        >
          {PARTNERS.map((name, index) => (
            <motion.span
              key={name}
              variants={itemVariants}
              whileHover={{
                scale: 1.1,
                backgroundColor: '#f0247a',
                color: '#ffffff',
                borderColor: '#f0247a',
                transition: { type: 'spring', stiffness: 400, damping: 17 },
              }}
              className="
                bg-slate-50 
                border 
                border-slate-200 
                text-slate-700 
                text-xs sm:text-sm 
                font-semibold 
                px-4 sm:px-5 
                py-2 sm:py-2.5 
                rounded-full 
                tracking-wide
                cursor-default
                inline-block
              "
            >
              {name}
            </motion.span>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-10 sm:mt-14 text-center"
        >
          <p className="text-sm sm:text-base text-slate-500 font-medium max-w-2xl mx-auto mb-4 sm:mb-6">
            Want to hire our graduates? Become a hiring partner and get access to top talent.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center justify-center rounded-full bg-accent text-white text-xs sm:text-sm font-semibold uppercase tracking-widest px-6 sm:px-8 py-3 sm:py-3.5 shadow-lg shadow-accent/25 hover:bg-[#d0246d] transition-all duration-200"
          >
            Become a Partner
          </a>
        </motion.div>
      </div>
    </section>
  )
}

export default HiringPartnersSection
