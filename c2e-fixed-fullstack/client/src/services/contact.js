import api from './axios'

export const submitContact = (payload) => api.post('/contact', payload).then((res) => res.data)

export const getContacts = (params = {}) => api.get('/contact', { params }).then((res) => res.data)

export const deleteContact = (id) => api.delete(`/contact/${id}`).then((res) => res.data)

