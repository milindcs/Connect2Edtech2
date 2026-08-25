// One "Why Choose" item (Component 01: Standard Card / "Why Choose Us
// Cards"): neumorphic floating chip with a raised icon badge + short label.
function WhyChooseItem({ icon: Icon, label }) {
  return (
    <div className="flex items-center gap-2.5 sm:gap-3 rounded-[1rem] sm:rounded-[1.25rem] bg-white border border-slate-100 shadow-sm px-3 sm:px-4 py-3 sm:py-4 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 w-full h-full">
      <span className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-black" strokeWidth={1.8} />
      </span>
      <p className="text-black text-xs sm:text-sm leading-snug font-semibold tracking-tight">{label}</p>
    </div>
  )
}

export default WhyChooseItem
