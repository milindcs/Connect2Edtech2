import { useParams } from 'react-router-dom'
import CourseCategoryPage from './CourseCategoryPage.jsx'
import CatalogToggle from '../components/common/CatalogToggle.jsx'
import { TECHNICAL_DEPARTMENTS } from '../constants/departments.js'
import TechnicalCatalogPage from './TechnicalCatalogPage.jsx'

// /courses/technical/:departmentSlug — reached from the Technical Catalog
// page by clicking a department card. Renders every course in that
// technical department, reusing the same CourseCategoryPage UI as before.
// The toggle at top still lets a visitor jump straight to the
// Non-Technical catalog without going back through the homepage.
function DepartmentCourses() {
  const { departmentSlug } = useParams()
  const department = TECHNICAL_DEPARTMENTS.find((d) => d.slug === departmentSlug)

  if (!department) return <TechnicalCatalogPage />

    return (
      <CourseCategoryPage
        department={department.value}
        topSlot={<CatalogToggle active="technical" />}
      />
    )
}

export default DepartmentCourses

