import { motion } from 'framer-motion'
import { isValidElement } from 'react'
import { fadeUp } from '../../../utils/animationVariants'
import useCountUp from '../../../hooks/useCountUp'

// One "Our Impact" tile (Component 01: Standard Card), neumorphic floating
// panel with a soft dual shadow.
function StatCard({ value, label, index = 0 }) {
  const isElement = isValidElement(value)

  if (isElement) {
    return (
      <motion.div
        custom={index}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeUp}
        className="flex flex-col items-center justify-center text-center gap-1 rounded-2xl sm:rounded-[1.25rem] bg-white border border-slate-100 shadow-sm px-3 sm:px-4 md:px-6 py-3 sm:py-5 md:py-7 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1"
      >
        <p className="text-black leading-none px-1 font-extrabold" style={{ fontSize: 'clamp(1.1rem, 3vw, 2rem)' }}>
          {value}
        </p>
        <p className="text-[10px] sm:text-[11px] md:text-xs uppercase tracking-wider text-slate-500 leading-tight px-1 font-medium">{label}</p>
      </motion.div>
    )
  }

  const { ref, formattedValue } = useCountUp(value)

  return (
    <motion.div
      ref={ref}
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={fadeUp}
      className="flex flex-col items-center justify-center text-center gap-1 rounded-2xl sm:rounded-[1.25rem] bg-white border border-slate-100 shadow-sm px-3 sm:px-4 md:px-6 py-3 sm:py-5 md:py-7 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1"
    >
      <p className="text-black leading-none px-1 font-extrabold" style={{ fontSize: 'clamp(1.1rem, 3vw, 2rem)' }}>
        {formattedValue}
      </p>
      <p className="text-[10px] sm:text-[11px] md:text-xs uppercase tracking-wider text-slate-500 leading-tight px-1 font-medium">{label}</p>
    </motion.div>
  )
}

export default StatCard
