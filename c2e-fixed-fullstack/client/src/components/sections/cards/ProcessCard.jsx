import { motion } from 'framer-motion'
import { fadeUp } from '../../../utils/animationVariants'

// One "How We Work" step (Component 01: Standard Card): neumorphic icon
// badge, numeric label, title, pink underline mark. Hover lift + icon-color
// intensification preserved from the original design.
function ProcessCard({ step, icon: Icon, title, description, index = 0 }) {
  return (
    <motion.div
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeUp}
      className="group flex flex-col items-center text-center gap-2 sm:gap-3 rounded-2xl sm:rounded-[1.5rem] bg-white border border-slate-100 shadow-sm px-3 sm:px-4 py-5 sm:py-8 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:shadow-md"
    >
      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center transition-colors duration-200 group-hover:bg-pink">
        <Icon className="w-5 h-5 sm:w-7 sm:h-7 text-pink transition-colors duration-200 group-hover:text-white" strokeWidth={1.8} />
      </div>
      <p className="text-[10px] sm:text-xs text-slate-500 font-semibold tracking-widest uppercase">{step}</p>
      <h3 className="text-black text-xs sm:text-sm leading-tight font-bold tracking-tight">{title}</h3>
      <span className="block w-4 h-[2px] sm:w-6 sm:h-[2px] rounded-full bg-pink" />
      {description && (
        <p className="text-slate-500 text-[9px] sm:text-xs leading-snug mt-0.5 hidden sm:block">{description}</p>
      )}
    </motion.div>
  )
}

export default ProcessCard
