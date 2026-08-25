import { Quote } from 'lucide-react'

// One "Success Stories" tile (Component 01: Standard Card), rendered inside
// the Marquee. Neumorphic floating card with a raised circular avatar.
function TestimonialCard({ quote, name, role, avatar }) {
  return (
    <div className="w-[260px] sm:w-[300px] md:w-[320px] flex flex-col gap-4 rounded-[1.75rem] bg-white border border-slate-100 shadow-sm px-6 py-6 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:shadow-md">
      <Quote className="w-6 h-6 sm:w-7 sm:h-7 text-pink" strokeWidth={2} />
      <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-medium">{quote}</p>
      <div className="flex items-center gap-3 mt-auto pt-2">
        <div className="w-9 h-9 rounded-full flex-shrink-0 overflow-hidden bg-slate-50 border border-slate-200 p-0.5">
          <div className="w-full h-full rounded-full overflow-hidden bg-gradient-to-br from-[#f2f2f2] to-[#dcdcdc]">
            {avatar && <img src={avatar} alt={name} className="w-full h-full object-cover" />}
          </div>
        </div>
        <div>
          <p className="text-black text-xs sm:text-sm font-bold tracking-tight">– {name}</p>
          <p className="text-slate-500 text-[11px] sm:text-xs font-medium tracking-wide">{role}</p>
        </div>
      </div>
    </div>
  )
}

export default TestimonialCard
