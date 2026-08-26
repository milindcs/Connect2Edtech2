import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import PageShell from '../components/layout/PageShell.jsx'
import CourseCard from '../components/sections/cards/CourseCard.jsx'
import CatalogToggle from '../components/common/CatalogToggle.jsx'
import { fadeUp } from '../utils/animationVariants'

const MOCK_COURSES = [
  {
    _id: '1',
    title: 'MERN Stack Development',
    description: 'Build full-stack web apps with MongoDB, Express, React, and Node.js.',
    category: 'technical',
  },
  {
    _id: '2',
    title: 'Data Science',
    description: 'Turn raw data into actionable insights using Python, statistics, and machine learning.',
    category: 'technical',
  },
  {
    _id: '3',
    title: 'UI/UX Design',
    description: 'Design intuitive, user-centered digital products with modern design tools.',
    category: 'technical',
  },
  {
    _id: '4',
    title: 'Cloud Engineering',
    description: 'Learn AWS, Azure, and GCP cloud architecture and DevOps pipelines.',
    category: 'technical',
  },
  {
    _id: '5',
    title: 'Digital Marketing',
    description: 'Master SEO, social media strategy, and analytics to drive business growth.',
    category: 'non-technical',
  },
  {
    _id: '6',
    title: 'Cyber Security',
    description: 'Learn ethical hacking, network security, and penetration testing.',
    category: 'technical',
  },
]

function CoursesPage() {
  const [category, setCategory] = useState('all')

  const courses = useMemo(() => {
    if (category === 'all') return MOCK_COURSES
    return MOCK_COURSES.filter((c) => c.category === category)
  }, [category])

  return (
    <PageShell showSharedSections={false}>
      <section className="w-full pb-10 sm:pb-14 md:pb-16">
        <div className="flex justify-center mb-6 sm:mb-8">
          <CatalogToggle active={category} onSelect={setCategory} />
        </div>

        {courses.length === 0 && (
          <p className="text-center text-gray-muted text-sm py-10">
            No courses are available yet — check back soon!
          </p>
        )}

        {courses.length > 0 && (
          <motion.div
            key={category}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.08,
                  delayChildren: 0.1,
                },
              },
            }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto"
          >
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
          </motion.div>
        )}
      </section>
    </PageShell>
  )
}

export default CoursesPage


