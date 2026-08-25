import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home.jsx'
import HeroPage from '../pages/HeroPage.jsx'
import AdminLogin from '../admin/pages/AdminLogin.jsx'
import AdminLayout from '../admin/AdminLayout.jsx'
import ProtectedRoute from '../admin/ProtectedRoute.jsx'
import DashboardOverview from '../admin/pages/DashboardOverview.jsx'
import AdminCourses from '../admin/pages/AdminCourses.jsx'
import AdminEnrollments from '../admin/pages/AdminEnrollments.jsx'
import AdminContacts from '../admin/pages/AdminContacts.jsx'
import AdminMentorApplications from '../admin/pages/AdminMentorApplications.jsx'
import AdminGallery from '../admin/pages/AdminGallery.jsx'
import AdminStudents from '../admin/pages/AdminStudents.jsx'
import AdminTrainers from '../admin/pages/AdminTrainers.jsx'
import Analytics from '../admin/pages/Analytics.jsx'
import Settings from '../admin/pages/Settings.jsx'
import ToastProvider from '../admin/components/ToastContext.jsx'
import SiteFrame from '../components/layout/SiteFrame.jsx'
import ScrollToHash from '../components/common/ScrollToHash.jsx'
import UserProtectedRoute from '../components/common/UserProtectedRoute.jsx'
import UserLogin from '../pages/UserLogin.jsx'
import UserRegister from '../pages/UserRegister.jsx'
import { Loader2 } from 'lucide-react'

// Lazy-loaded public pages — only fetched when the route is visited
const About = lazy(() => import('../pages/About.jsx'))
const TechnicalCatalogPage = lazy(() => import('../pages/TechnicalCatalogPage.jsx'))
const NonTechnicalCatalogPage = lazy(() => import('../pages/NonTechnicalCatalogPage.jsx'))
const DepartmentCourses = lazy(() => import('../pages/DepartmentCourses.jsx'))
const MentorApplication = lazy(() => import('../pages/MentorApplication.jsx'))
const Mentors = lazy(() => import('../pages/Mentors.jsx'))
const EnrollmentPage = lazy(() => import('../pages/EnrollmentPage.jsx'))
const CourseDetailPage = lazy(() => import('../pages/CourseDetailPage.jsx'))
const CoursesPage = lazy(() => import('../pages/CoursesPage.jsx'))
const ContactPage = lazy(() => import('../pages/ContactPage.jsx'))

function App() {
  return (
    <SiteFrame>
      <ScrollToHash />
      <Suspense
        fallback={
          <div className="w-full h-[calc(100vh-4rem)] flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-accent" />
          </div>
        }
      >
        <Routes>
          {/* Public website */}
          <Route path="/" element={<Home />} />
          <Route path="/hero" element={<HeroPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/courses/technical" element={<TechnicalCatalogPage />} />
          <Route path="/courses/technical/:departmentSlug" element={<DepartmentCourses />} />
          <Route path="/courses/non-technical" element={<NonTechnicalCatalogPage />} />
          <Route path="/courses/:courseId" element={<CourseDetailPage />} />
          <Route path="/enroll/:courseId" element={<EnrollmentPage />} />
          <Route path="/mentor-application" element={<MentorApplication />} />
          <Route path="/mentors" element={<Mentors />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* User auth */}
          <Route path="/login" element={<UserLogin />} />
          <Route path="/register" element={<UserRegister />} />

          {/* Admin */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <ToastProvider>
                  <AdminLayout />
                </ToastProvider>
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardOverview />} />
            <Route path="courses" element={<AdminCourses />} />
            <Route path="enrollments" element={<AdminEnrollments />} />
            <Route path="students" element={<AdminStudents />} />
            <Route path="trainers" element={<AdminTrainers />} />
            <Route path="mentor-applications" element={<AdminMentorApplications />} />
            <Route path="messages" element={<AdminContacts />} />
            <Route path="gallery" element={<AdminGallery />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Home />} />
        </Routes>
      </Suspense>
    </SiteFrame>
  )
}

export default App
