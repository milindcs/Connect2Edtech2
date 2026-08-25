import { motion } from 'framer-motion'

function SkillCard({
  icon: Icon,
  title,
  description,
  tags,
  level,
  progress,
  accent = 'from-blue-500 to-cyan-400',
}) {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 20,
      }}
      className="group relative h-full rounded-2xl sm:rounded-3xl p-[1px]"
      style={{
        backgroundImage: `linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))`,
      }}
    >
      <div
        className="relative h-full rounded-2xl sm:rounded-3xl p-6 sm:p-7 md:p-8 flex flex-col gap-5 sm:gap-6 transition-colors duration-300"
        style={{ backgroundColor: '#121212' }}
      >
        <div
          className="absolute inset-0 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.01))`,
            boxShadow: `0 0 40px -20px rgba(255,255,255,0.12)`,
          }}
        />

        <div className="relative flex items-center gap-3 sm:gap-4">
          <div
            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center bg-gradient-to-br ${accent} shadow-lg`}
          >
            <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" strokeWidth={2} />
          </div>

          <div className="flex flex-col">
            <h3 className="text-white font-bold tracking-tight text-base sm:text-lg">
              {title}
            </h3>
            <span className="text-gray-400 text-xs sm:text-sm font-medium">
              {level}
            </span>
          </div>
        </div>

        <p className="relative text-gray-300 text-xs sm:text-sm leading-relaxed">
          {description}
        </p>

        <div className="relative flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] sm:text-xs font-medium text-gray-200"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="relative mt-auto pt-4 sm:pt-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-xs font-medium">
              Proficiency
            </span>
            <span className="text-gray-200 text-xs font-bold">
              {progress}%
            </span>
          </div>

          <div
            className="h-1.5 sm:h-2 rounded-full overflow-hidden"
            style={{ backgroundColor: '#1a1a1a' }}
          >
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${progress}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              className={`h-full rounded-full bg-gradient-to-r ${accent}`}
            />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default SkillCard
