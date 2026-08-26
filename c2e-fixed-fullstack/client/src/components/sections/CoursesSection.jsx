import { motion } from 'framer-motion'
import SectionHeading from '../common/SectionHeading.jsx'
import CourseCard from './cards/CourseCard.jsx'
import { fadeUp } from '../../utils/animationVariants'

const MOCK_COURSES = [
  {
    _id: '1',
    title: 'Full Stack Development',
    description: 'Master modern web development with React, Node.js, MongoDB, and cloud deployment — from beginner to job-ready.',
  },
  {
    _id: '2',
    title: 'Data Science',
    description: 'Learn Python, statistics, machine learning, and data visualization tools to unlock insights from real-world datasets.',
  },
  {
    _id: '3',
    title: 'UI/UX Design',
    description: 'Master user research, wireframing, prototyping, and modern design tools like Figma to create stunning digital experiences.',
  },
  {
    _id: '4',
    title: 'Cloud Engineering',
    description: 'Learn AWS, Azure, and GCP cloud architecture, DevOps pipelines, and infrastructure-as-code to build scalable systems.',
  },
  {
    _id: '5',
    title: 'Digital Marketing',
    description: 'Master SEO, social media strategy, content marketing, and analytics to drive real business growth.',
  },
  {
    _id: '6',
    title: 'Cyber Security',
    description: 'Learn ethical hacking, network security, penetration testing, and compliance frameworks to protect digital assets.',
  },
]

function CoursesSection() {
  const courses = MOCK_COURSES.slice(0, 6)
  return (
    <motion.section
      id="courses"
      className="w-full px-4 sm:px-6 md:px-8 py-10 sm:py-14 md:py-20 bg-white"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1,
          },
        },
      }}
    >
      <motion.div variants={fadeUp}>
        <SectionHeading
          title="OUR COURSES"
          subtitle="Explore a wide range of industry-relevant courses designed to build future-ready skills."
          align="left"
          className="mb-10 sm:mb-14 md:mb-20"
        />
      </motion.div>

      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {courses.map((course, i) => (
          <motion.div key={course._id} variants={fadeUp} custom={i}>
            <CourseCard
              title={course.title}
              description={course.description}
              courseId={course._id}
              ctaLabel="View Details"
              index={i}
            />
          </motion.div>
        ))}
      </div>

      <motion.div variants={fadeUp} className="flex justify-center mt-10 sm:mt-14">
        <a
          href="/courses"
          className="inline-flex items-center justify-center rounded-full px-9 py-3.5 text-[11px] sm:text-xs uppercase tracking-[0.08em] text-white bg-pink shadow-[6px_6px_14px_#c9457f,-6px_-6px_14px_#ff5aa3] hover:shadow-[8px_8px_18px_#c9457f,-8px_-8px_18px_#ff64ab] transition-all duration-200 active:translate-y-[1px]"
        >
          View Full Catalog
        </a>
      </motion.div>
    </motion.section>
  )
}

export default CoursesSection

