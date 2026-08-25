import { useState } from 'react'
import { NavLink, Outlet, useLocation, Link } from 'react-router-dom'
import {
  LayoutDashboard,
  BookOpen,
  MessageSquare,
  Users,
  Images,
  LogOut,
  GraduationCap,
  Menu,
  X,
  Home,
  UserCircle,
  BarChart3,
  Settings,
  UserPlus,
  Bell,
} from 'lucide-react'
import { useAdminAuth } from '../context/AdminAuthContext.jsx'

const NAV_GROUPS = [
  {
    title: 'Main',
    items: [
      { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
    ],
  },
  {
    title: 'Management',
    items: [
      { to: '/admin/dashboard/students', label: 'Students', icon: Users },
      { to: '/admin/dashboard/courses', label: 'Courses', icon: BookOpen },
      { to: '/admin/dashboard/enrollments', label: 'Enrollments', icon: GraduationCap },
      { to: '/admin/dashboard/trainers', label: 'Instructors', icon: UserCircle },
      { to: '/admin/dashboard/mentor-applications', label: 'Mentor Applications', icon: UserPlus },
      { to: '/admin/dashboard/messages', label: 'Contacts', icon: MessageSquare },
      { to: '/admin/dashboard/gallery', label: 'Gallery', icon: Images },
    ],
  },
  {
    title: 'System',
    items: [
      { to: '/admin/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
      { to: '/admin/dashboard/settings', label: 'Settings', icon: Settings },
    ],
  },
]

const TITLES = {
  '/admin/dashboard': 'Dashboard Overview',
  '/admin/dashboard/students': 'Student Management',
  '/admin/dashboard/courses': 'Course Management',
  '/admin/dashboard/enrollments': 'Enrollment Management',
  '/admin/dashboard/trainers': 'Instructor Management',
  '/admin/dashboard/mentor-applications': 'Mentor Applications',
  '/admin/dashboard/messages': 'Contact Management',
  '/admin/dashboard/gallery': 'Gallery Management',
  '/admin/dashboard/analytics': 'Analytics & Reports',
  '/admin/dashboard/settings': 'Settings',
}

function SidebarContent({ onNavigate }) {
  const { admin, logout } = useAdminAuth()

  return (
    <>
      <div className="px-2 mb-8">
        <div className="flex items-center gap-2.5 mb-1">
          <img src="/assets/cc2e.png" alt="Connect2EdTech" className="w-8 h-8 rounded-lg object-cover" />
          <h2 className="text-sm font-bold uppercase tracking-widest">Connect2Edtech</h2>
        </div>
        <p className="text-[11px] text-white/40 pl-[42px]">Admin Dashboard</p>
      </div>

      <Link
        to="/"
        onClick={onNavigate}
        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/80 hover:text-white hover:bg-white/5 transition-colors mb-6"
      >
        <Home className="w-4 h-4" />
        Back to Website
      </Link>

      <nav className="flex flex-col gap-5 flex-1 overflow-y-auto">
        {NAV_GROUPS.map((group) => (
          <div key={group.title}>
            <p className="px-3 text-[10px] font-semibold uppercase tracking-widest text-white/30 mb-2">{group.title}</p>
            <div className="flex flex-col gap-0.5">
              {group.items.map(({ to, label, icon: Icon, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all relative ${
                      isActive
                        ? 'bg-gradient-to-r from-accent/25 to-pink/15 text-white shadow-sm'
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-accent rounded-r-full" />
                      )}
                      <Icon className="w-4 h-4" />
                      {label}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="px-2 pt-4 border-t border-white/10 mt-4">
        <p className="text-xs text-white/60 mb-3 truncate">{admin?.name || admin?.email}</p>
        <button
          onClick={logout}
          className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-white/70 hover:text-pink transition-colors"
        >
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>
    </>
  )
}

function AdminLayout() {
  const { admin } = useAdminAuth()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const location = useLocation()
  const currentTitle = TITLES[location.pathname] || 'Admin'

  const today = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col font-ui">
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 h-14">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setDrawerOpen(true)}
            className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <p className="text-sm font-semibold text-slate-900 leading-tight">{currentTitle}</p>
            <p className="text-[11px] text-slate-400 hidden sm:block">{today}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
            aria-label="Notifications"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-pink ring-2 ring-white" />
          </button>
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-[11px] sm:text-xs font-semibold text-slate-900">{admin?.name || 'Admin'}</span>
            <span className="text-[10px] sm:text-[11px] text-slate-400">{admin?.email}</span>
          </div>
          <div className="relative">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-accent to-pink text-white flex items-center justify-center text-xs sm:text-sm font-bold uppercase shadow-sm ring-2 ring-white">
              {(admin?.name || 'A').charAt(0)}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white" title="Online" />
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        <aside className="hidden lg:flex w-60 flex-shrink-0 bg-slate-900 text-white flex-col py-6 px-4 sticky top-14 h-[calc(100vh-3.5rem)]">
          <SidebarContent />
        </aside>

        {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-slate-900 text-white flex flex-col py-6 px-4 shadow-2xl">
            <button
              onClick={() => setDrawerOpen(false)}
              className="absolute right-4 top-4 p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
            <SidebarContent onNavigate={() => setDrawerOpen(false)} />
          </aside>
        </div>
        )}

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
