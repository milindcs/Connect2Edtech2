import api from './axios'

export const submitMentorApplication = (formData) =>
  api
    .post('/mentor-application', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
    .then((res) => res.data)

export const getMentorApplications = (arg) => {
  const params = typeof arg === 'string' ? { status: arg } : arg || {}
  return api.get('/mentor-application', { params }).then((res) => res.data)
}

export const updateMentorApplicationStatus = (id, status) =>
  api.put(`/mentor-application/${id}`, { status }).then((res) => res.data)

export const deleteMentorApplication = (id) =>
  api.delete(`/mentor-application/${id}`).then((res) => res.data)

// Downloads the resume as a blob (auth header is attached by the axios
// interceptor) and triggers a browser save-as dialog.
export const downloadResume = async (id, filename = 'resume') => {
  const response = await api.get(`/mentor-application/${id}/resume`, { responseType: 'blob' })
  const url = window.URL.createObjectURL(new Blob([response.data]))
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
}

