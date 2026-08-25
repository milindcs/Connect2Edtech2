import api from './axios'

export const submitEnrollment = (payload) => api.post('/enrollment', payload).then((res) => res.data)

export const getEnrollments = (arg) => {
  const params = typeof arg === 'string' ? { status: arg } : arg || {}
  return api.get('/enrollment', { params }).then((res) => res.data)
}

export const updateEnrollmentStatus = (id, status) =>
  api.put(`/enrollment/${id}`, { status }).then((res) => res.data)

export const deleteEnrollment = (id) => api.delete(`/enrollment/${id}`).then((res) => res.data)

