import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Users,
  GraduationCap,
  MessageSquare,
  UserPlus,
  Clock,
  Loader2,
  Zap,
  UserCircle,
  Images,
  Sparkles,
  ArrowUpRight,
  CalendarDays,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import api from '../../services/axios.js';
import AnimatedCounter from '../components/AnimatedCounter.jsx';

const PIE_COLORS = { Pending: '#F59E0B', Enrolled: '#10B981', Rejected: '#EF4444' };

function greetingForHour(hour) {
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function timeAgo(iso) {
  if (!iso) return '';
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function ChartTooltip({ active, payload, label, suffix = '' }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="rounded-lg border border-black/5 bg-white px-3 py-2 shadow-lg text-xs">
      {label != null && <p className="font-semibold text-black mb-0.5">{label}</p>}
      {payload.map((p) => (
        <p key={p.name} className="flex items-center gap-1.5 text-gray-muted">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color || p.fill }} />
          {p.name}: <span className="font-semibold text-black">{p.value}{suffix}</span>
        </p>
      ))}
    </div>
  );
}

function DashboardOverview() {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([api.get('/dashboard/stats'), api.get('/dashboard/recent')])
      .then(([statsRes, recentRes]) => {
        if (cancelled) return;
        setStats(statsRes.data.data);
        setRecent(recentRes.data.data);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setError('Failed to load dashboard data');
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col gap-6 animate-pulse">
        <div className="h-28 rounded-2xl bg-black/[0.04]" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="h-24 rounded-xl bg-black/[0.04]" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="h-72 rounded-xl bg-black/[0.04]" />
          <div className="h-72 rounded-xl bg-black/[0.04]" />
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="text-center py-24">
        <div className="mx-auto mb-3 w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center">
          <CalendarDays className="w-5 h-5" />
        </div>
        <p className="text-sm text-gray-muted">{error || 'Something went wrong'}</p>
      </div>
    );
  }

  const now = new Date();
  const pendingRatio =
    stats.totalEnrollments > 0
      ? Math.round((stats.pendingEnrollments / stats.totalEnrollments) * 100)
      : 0;

  const statCards = [
    { label: 'Total Students', value: stats.totalStudents, icon: Users, to: '/admin/dashboard/students', chip: 'bg-accent/10 text-accent', stroke: '#5E0ED7' },
    { label: 'Total Courses', value: stats.totalCourses, icon: BookOpen, to: '/admin/dashboard/courses', chip: 'bg-pink/10 text-pink', stroke: '#F0247A' },
    { label: 'Technical Courses', value: stats.technicalCourses, icon: Zap, to: '/admin/dashboard/courses', chip: 'bg-blue-500/10 text-blue-500', stroke: '#0EA5E9' },
    { label: 'Non-Tech Courses', value: stats.nonTechnicalCourses, icon: BookOpen, to: '/admin/dashboard/courses', chip: 'bg-amber-500/10 text-amber-500', stroke: '#F59E0B' },
    { label: 'Total Enrollments', value: stats.totalEnrollments, icon: GraduationCap, to: '/admin/dashboard/enrollments', chip: 'bg-emerald-500/10 text-emerald-500', stroke: '#10B981' },
    { label: 'Pending Enrollments', value: stats.pendingEnrollments, icon: Clock, to: '/admin/dashboard/enrollments', chip: 'bg-orange-500/10 text-orange-500', stroke: '#F97316' },
    { label: 'Instructors', value: stats.totalTrainers, icon: UserCircle, to: '/admin/dashboard/trainers', chip: 'bg-cyan-500/10 text-cyan-500', stroke: '#06B6D4' },
    { label: 'Contact Messages', value: stats.totalContacts, icon: MessageSquare, to: '/admin/dashboard/messages', chip: 'bg-violet-500/10 text-violet-500', stroke: '#8B5CF6' },
    { label: 'Mentor Applications', value: stats.totalMentorApplications, icon: UserPlus, to: '/admin/dashboard/mentor-applications', chip: 'bg-teal-500/10 text-teal-500', stroke: '#14B8A6' },
    { label: 'Gallery Images', value: stats.totalGallery, icon: Images, to: '/admin/dashboard/gallery', chip: 'bg-fuchsia-500/10 text-fuchsia-500', stroke: '#D946EF' },
  ];

  const enrollmentPieData = (stats.enrollmentStatusBreakdown || []).map((item) => ({
    name: item._id,
    value: item.count,
  }));
  const pieTotal = enrollmentPieData.reduce((s, d) => s + d.value, 0);

  const deptData = (stats.coursesByDepartment || []).map((d) => ({ name: d._id, count: d.count }));

  const quickActions = [
    { label: 'Add Course', to: '/admin/dashboard/courses', icon: BookOpen },
    { label: 'Review Mentors', to: '/admin/dashboard/mentor-applications', icon: UserPlus },
    { label: 'View Messages', to: '/admin/dashboard/messages', icon: MessageSquare },
  ];

  return (
    <div className="flex flex-col gap-5 sm:gap-6">
      <h1 className="sr-only">Dashboard Overview</h1>
      {/* Welcome banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-accent to-pink p-5 sm:p-7 text-white shadow-lg shadow-accent/10">
        <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute right-6 bottom-0 opacity-20">
          <Sparkles className="w-28 h-28" />
        </div>
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-white/70">
              {now.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
            </p>
            <h2 className="mt-1 text-xl sm:text-2xl font-bold">
              {greetingForHour(now.getHours())}, Admin
            </h2>
            <p className="text-sm text-white/80 mt-1">
              Here's what's happening across your platform today.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {quickActions.map((a) => (
              <Link
                key={a.label}
                to={a.to}
                className="inline-flex items-center gap-1.5 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur px-3.5 py-2 text-xs font-semibold transition-colors"
              >
                <a.icon className="w-3.5 h-3.5" />
                {a.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {statCards.map((card) => (
          <Link
            key={card.label}
            to={card.to}
            className="group relative bg-white rounded-xl border border-black/5 p-3.5 sm:p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:border-black/10 transition-all"
          >
            <div className="flex items-center justify-between mb-2.5 sm:mb-3">
              <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center ${card.chip}`}>
                <card.icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-black/0 group-hover:text-black/30 transition-colors" />
            </div>
            <p className="text-xl sm:text-2xl font-bold text-black leading-none tabular-nums">
              <AnimatedCounter end={card.value} />
            </p>
            <p className="text-[10px] sm:text-xs text-gray-muted mt-1.5 truncate">{card.label}</p>
          </Link>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white rounded-2xl border border-black/5 p-4 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-black">Enrollment Status</h3>
              <p className="text-[11px] text-gray-muted">Distribution by current state</p>
            </div>
            <span className="rounded-full bg-orange-500/10 px-2.5 py-1 text-[10px] font-semibold text-orange-500">
              {pendingRatio}% pending
            </span>
          </div>
          <div className="h-56 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={enrollmentPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {enrollmentPieData.map((entry) => (
                    <Cell key={entry.name} fill={PIE_COLORS[entry.name] || '#888'} />
                  ))}
                </Pie>
                <text x="50%" y="46%" textAnchor="middle" className="fill-black" style={{ fontSize: 22, fontWeight: 700 }}>
                  {pieTotal}
                </text>
                <text x="50%" y="56%" textAnchor="middle" className="fill-gray-muted" style={{ fontSize: 10 }}>
                  Total
                </text>
                <Tooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mt-2">
            {enrollmentPieData.map((entry) => (
              <div key={entry.name} className="flex items-center gap-1.5 text-[11px]">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[entry.name] || '#888' }} />
                <span className="text-gray-muted">{entry.name}</span>
                <span className="font-semibold text-black">{entry.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-black/5 p-4 sm:p-6 shadow-sm">
          <div>
            <h3 className="text-sm font-bold text-black">Courses by Department</h3>
            <p className="text-[11px] text-gray-muted mb-4">Offering count per department</p>
          </div>
          <div className="h-56 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <defs>
                  <linearGradient id="deptBar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#5E0ED7" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#F0247A" stopOpacity={0.9} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#8A8A8A' }} interval={0} angle={-15} textAnchor="end" height={50} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#8A8A8A' }} allowDecimals={false} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: 'rgba(0,0,0,0.03)' }} content={<ChartTooltip />} />
                <Bar dataKey="count" name="Courses" fill="url(#deptBar)" radius={[6, 6, 0, 0]} maxBarSize={44} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent activity */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <RecentCard
          title="Recent Contacts"
          to="/admin/dashboard/messages"
          data={recent?.recentContacts || []}
          initials={(c) => (c.name || '?').charAt(0)}
          chip="bg-accent/10 text-accent"
          line1={(c) => c.name}
          line2={(c) => c.email}
          time={(c) => c.createdAt}
        />
        <RecentCard
          title="Recent Enrollments"
          to="/admin/dashboard/enrollments"
          data={recent?.recentEnrollments || []}
          initials={(e) => (e.fullName || '?').charAt(0)}
          chip="bg-pink/10 text-pink"
          line1={(e) => e.fullName}
          line2={(e) => e.courseTitle || e.course?.title}
          time={(e) => e.createdAt}
        />
        <RecentCard
          title="Mentor Applications"
          to="/admin/dashboard/mentor-applications"
          data={recent?.recentMentorApplications || []}
          initials={(m) => (m.fullName || '?').charAt(0)}
          chip="bg-emerald-500/10 text-emerald-500"
          line1={(m) => m.fullName}
          line2={(m) => m.currentDesignation}
          time={(m) => m.createdAt}
        />
      </div>
    </div>
  );
}

function RecentCard({ title, to, data, initials, chip, line1, line2, time }) {
  return (
    <div className="bg-white rounded-2xl border border-black/5 p-4 sm:p-5 shadow-sm flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-black">{title}</h3>
        <Link to={to} className="text-[11px] font-semibold text-accent hover:underline">View all</Link>
      </div>
      <div className="flex flex-col gap-3 flex-1">
        {data.slice(0, 4).map((item, i) => (
          <div key={item._id || i} className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${chip}`}>
              {initials(item)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-black truncate">{line1(item)}</p>
              <p className="text-[10px] text-gray-muted truncate">{line2(item)}</p>
            </div>
            <span className="text-[10px] text-gray-muted whitespace-nowrap">{timeAgo(time(item))}</span>
          </div>
        ))}
        {data.length === 0 && (
          <p className="text-xs text-gray-muted py-2">Nothing here yet</p>
        )}
      </div>
    </div>
  );
}

export default DashboardOverview;
