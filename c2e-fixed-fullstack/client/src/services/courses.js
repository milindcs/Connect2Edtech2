import api from './axios'

// Accepts either a plain category string (legacy calls) or a params object
// like { department: 'Computer Science' } / { category: 'technical' }.
const toParams = (arg) => (typeof arg === 'string' ? { category: arg } : arg || {})

export const getCourses = (arg) => api.get('/courses', { params: toParams(arg) }).then((res) => res.data)

export const getAllCoursesAdmin = (arg) =>
  api.get('/courses/admin/all', { params: toParams(arg) }).then((res) => res.data)

export const getCourseById = (id) => api.get(`/courses/${id}`).then((res) => res.data)

export const createCourse = (formData) =>
  api
    .post('/courses', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
    .then((res) => res.data)

export const updateCourse = (id, formData) =>
  api
    .put(`/courses/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
    .then((res) => res.data)

export const deleteCourse = (id) => api.delete(`/courses/${id}`).then((res) => res.data)

export const setCourseStatus = (id, status) =>
  api.patch(`/courses/${id}/status`, { status }).then((res) => res.data)

