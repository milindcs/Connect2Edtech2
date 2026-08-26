import SectionHeading from '../common/SectionHeading.jsx'
import Marquee from '../common/Marquee.jsx'
import { AnimatedItem } from '../common/AnimatedSection.jsx'
import TestimonialCard from './cards/TestimonialCard.jsx'

// Content volume per Section 6.6: at least 9–12 unique placeholder
// testimonials so the marquee doesn't feel repetitive before it loops.
const TESTIMONIALS = [
  { name: 'Neha K.', role: 'Full Stack Developer', quote: 'Connect2Edtech gave me the right skills and confidence to land my dream job.' },
  { name: 'Arjun R.', role: 'Software Engineer', quote: 'The projects and mentorship I received helped me crack multiple interviews.' },
  { name: 'Sneha P.', role: 'Data Analyst', quote: 'I went from a beginner to a job-ready developer. Highly recommended.' },
  { name: 'Rohit M.', role: 'Backend Engineer', quote: 'The hands-on projects made all the difference when I was interviewing.' },
  { name: 'Priya D.', role: 'QA Engineer', quote: 'Structured learning paths kept me focused instead of overwhelmed.' },
  { name: 'Karan S.', role: 'Product Analyst', quote: 'Mentor feedback was honest and specific — exactly what I needed.' },
  { name: 'Ananya V.', role: 'UI/UX Designer', quote: 'I finally understood how design and development fit together.' },
  { name: 'Vikram T.', role: 'DevOps Engineer', quote: 'Practical, no-fluff curriculum. I could apply what I learned immediately.' },
  { name: 'Meera J.', role: 'Machine Learning Engineer', quote: 'The placement support team stayed with me through every interview round.' },
  { name: 'Aditya R.', role: 'Cloud Engineer', quote: "Real-world projects, not just theory. That's what set this apart." },
]

function SuccessStoriesSection() {
  return (
      <section className="w-full px-4 sm:px-6 md:px-8 py-12 sm:py-16 md:py-20 lg:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <SectionHeading title="SUCCESS STORIES" align="left" className="mb-10 sm:mb-14 md:mb-16" />
      </div>

      <Marquee
        speed={50}
        gap={24}
        items={TESTIMONIALS.map((t, i) => (
          <AnimatedItem key={t.name} index={i}>
            <TestimonialCard {...t} />
          </AnimatedItem>
        ))}
      />
    </section>
  )
}

export default SuccessStoriesSection

