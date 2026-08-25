const asyncHandler = require('../utils/asyncHandler');
const Course = require('../models/Course');
const Contact = require('../models/Contact');
const MentorApplication = require('../models/MentorApplication');
const Enrollment = require('../models/Enrollment');
const Gallery = require('../models/Gallery');
const User = require('../models/User');
const Trainer = require('../models/Trainer');

const getDashboardStats = asyncHandler(async (req, res) => {
  console.log('[getDashboardStats] Starting...');

  const [
    totalCourses,
    activeCourses,
    totalContacts,
    totalStudents,
    technicalCourses,
    nonTechnicalCourses,
    totalEnrollments,
    pendingEnrollments,
    totalTrainers,
    totalGallery,
    totalMentorApplications,
  ] = await Promise.all([
    Course.countDocuments(),
    Course.countDocuments({ status: 'Active' }),
    Contact.countDocuments(),
    User.countDocuments(),
    Course.countDocuments({ category: 'technical' }),
    Course.countDocuments({ category: 'non-technical' }),
    Enrollment.countDocuments(),
    Enrollment.countDocuments({ status: 'Pending' }),
    Trainer.countDocuments(),
    Gallery.countDocuments(),
    MentorApplication.countDocuments(),
  ]);

  const enrollmentStatusBreakdown = await Enrollment.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]).exec();

  const coursesByDepartment = await Course.aggregate([
    { $group: { _id: '$department', count: { $sum: 1 } } },
  ]).exec();

  console.log('[getDashboardStats] Done:', { totalCourses, totalStudents, totalEnrollments });
  res.json({
    success: true,
    data: {
      totalCourses,
      activeCourses,
      totalContacts,
      totalStudents,
      technicalCourses,
      nonTechnicalCourses,
      totalEnrollments,
      pendingEnrollments,
      totalTrainers,
      totalGallery,
      totalMentorApplications,
      enrollmentStatusBreakdown,
      coursesByDepartment,
    },
  });
});

const getAnalytics = asyncHandler(async (req, res) => {
  const now = new Date();
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

  const [monthlyEnrollments, enrollmentByCourse, enrollmentByStatus, techVsNonTech, studentGrowth] =
    await Promise.all([
      Enrollment.aggregate([
        { $match: { createdAt: { $gte: sixMonthsAgo } } },
        { $group: { _id: { $month: '$createdAt', $year: '$createdAt' }, count: { $sum: 1 } } },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
      ]).exec(),
      Enrollment.aggregate([
        { $group: { _id: '$courseTitle', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]).exec(),
      Enrollment.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]).exec(),
      Course.aggregate([
        {
          $lookup: {
            from: 'enrollments',
            localField: '_id',
            foreignField: 'course',
            as: 'enrollments',
          },
        },
        {
          $group: {
            _id: '$category',
            courseCount: { $sum: 1 },
            enrollmentCount: { $sum: { $size: '$enrollments' } },
          },
        },
      ]).exec(),
      User.aggregate([
        { $match: { createdAt: { $gte: sixMonthsAgo } } },
        { $group: { _id: { $month: '$createdAt', $year: '$createdAt' }, count: { $sum: 1 } } },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
      ]).exec(),
    ]);

  res.json({
    success: true,
    data: { monthlyEnrollments, enrollmentByCourse, enrollmentByStatus, techVsNonTech, studentGrowth },
  });
});

const getRecentDetails = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 5;
  const [recentContacts, recentEnrollments, recentMentorApplications] = await Promise.all([
    Contact.find().sort({ createdDate: -1 }).limit(limit).lean(),
    Enrollment.find().sort({ createdDate: -1 }).limit(limit).populate('course', 'title').lean(),
    MentorApplication.find().sort({ createdDate: -1 }).limit(limit).lean(),
  ]);
  res.json({
    success: true,
    data: { recentContacts, recentEnrollments, recentMentorApplications },
  });
});

module.exports = { getDashboardStats, getRecentDetails, getAnalytics };
