import { useEffect, useState } from 'react';
import { Loader2, TrendingUp, BarChart3 } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
} from 'recharts';
import { getDashboardAnalytics } from '../../services/admin.js';
import AnimatedCounter from '../components/AnimatedCounter.jsx';
import AdminPageHeader from '../components/AdminPageHeader.jsx';

const COLORS = ['#5E0ED7', '#F0247A', '#0EA5E9', '#F59E0B', '#10B981'];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    getDashboardAnalytics()
      .then((res) => {
        if (cancelled) return;
        setData(res.data);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setError('Failed to load analytics');
        setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  if (loading) return <div className="flex justify-center py-24"><Loader2 className="w-6 h-6 animate-spin text-accent" /></div>;
  if (error || !data) return <div className="text-center py-24 text-sm text-gray-muted">{error || 'No data'}</div>;

  const monthlyData = data.monthlyEnrollments.map((d) => ({
    name: `${MONTHS[d._id.month - 1]} ${d._id.year}`,
    enrollments: d.count,
  }));

  const studentGrowthData = data.studentGrowth.map((d) => ({
    name: `${MONTHS[d._id.month - 1]} ${d._id.year}`,
    students: d.count,
  }));

  const statusData = data.enrollmentByStatus.map((s) => ({ name: s._id, value: s.count }));
  const PIE_COLORS = { Pending: '#F59E0B', Enrolled: '#10B981', Rejected: '#EF4444' };

  const popularCourses = data.enrollmentByCourse.map((c) => ({ name: c._id, enrollments: c.count }));

  const techData = data.techVsNonTech.map((t) => ({
    category: t._id === 'technical' ? 'Technical' : 'Non-Technical',
    courses: t.courseCount,
    enrollments: t.enrollmentCount,
  }));

  const totalEnrollments = statusData.reduce((sum, s) => sum + s.value, 0);

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader
        title="Analytics"
        subtitle="Enrollment trends and performance insights."
        icon={BarChart3}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-xl border border-black/5 p-4 shadow-sm">
          <p className="text-[10px] sm:text-xs text-gray-muted uppercase tracking-wide">Total Enrollments</p>
          <p className="text-xl sm:text-2xl font-bold text-black mt-1"><AnimatedCounter end={totalEnrollments} /></p>
        </div>
        <div className="bg-white rounded-xl border border-black/5 p-4 shadow-sm">
          <p className="text-[10px] sm:text-xs text-gray-muted uppercase tracking-wide">Technical Enrollments</p>
          <p className="text-xl sm:text-2xl font-bold text-accent mt-1">
            <AnimatedCounter end={techData.find((t) => t.category === 'Technical')?.enrollments || 0} />
          </p>
        </div>
        <div className="bg-white rounded-xl border border-black/5 p-4 shadow-sm">
          <p className="text-[10px] sm:text-xs text-gray-muted uppercase tracking-wide">Non-Technical Enrollments</p>
          <p className="text-xl sm:text-2xl font-bold text-pink mt-1">
            <AnimatedCounter end={techData.find((t) => t.category === 'Non-Technical')?.enrollments || 0} />
          </p>
        </div>
        <div className="bg-white rounded-xl border border-black/5 p-4 shadow-sm">
          <p className="text-[10px] sm:text-xs text-gray-muted uppercase tracking-wide">Courses Offered</p>
          <p className="text-xl sm:text-2xl font-bold text-black mt-1">
            <AnimatedCounter end={techData.reduce((s, t) => s + t.courses, 0)} />
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white rounded-xl border border-black/5 p-4 sm:p-6 shadow-sm">
          <h3 className="text-sm font-bold text-black mb-4">Monthly Enrollments</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="enrollGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#5E0ED7" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#5E0ED7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                <Tooltip />
                <Area type="monotone" dataKey="enrollments" stroke="#5E0ED7" fill="url(#enrollGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-black/5 p-4 sm:p-6 shadow-sm">
          <h3 className="text-sm font-bold text-black mb-4">Student Growth</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={studentGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="students" stroke="#F0247A" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-black/5 p-4 sm:p-6 shadow-sm">
          <h3 className="text-sm font-bold text-black mb-4">Technical vs Non-Technical</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={techData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="category" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="courses" fill="#5E0ED7" radius={[4, 4, 0, 0]} name="Courses" />
                <Bar dataKey="enrollments" fill="#F0247A" radius={[4, 4, 0, 0]} name="Enrollments" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-black/5 p-4 sm:p-6 shadow-sm">
          <h3 className="text-sm font-bold text-black mb-4">Enrollment Status</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                  {statusData.map((entry) => (
                    <Cell key={entry.name} fill={PIE_COLORS[entry.name] || '#888'} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-black/5 p-4 sm:p-6 shadow-sm">
        <h3 className="text-sm font-bold text-black mb-4">Most Popular Courses</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={popularCourses} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" tick={{ fontSize: 10 }} allowDecimals={false} />
              <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 10 }} />
              <Tooltip />
              <Bar dataKey="enrollments" fill="#5E0ED7" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Analytics;


