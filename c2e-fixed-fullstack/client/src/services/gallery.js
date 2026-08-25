import api from './axios'

export const getGalleryImages = () => api.get('/gallery').then((res) => res.data)

export const getGalleryImageById = (id) => api.get(`/gallery/${id}`).then((res) => res.data)

export const createGalleryImage = (formData) =>
  api
    .post('/gallery', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
    .then((res) => res.data)

export const updateGalleryImage = (id, formData) =>
  api
    .put(`/gallery/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
    .then((res) => res.data)

export const deleteGalleryImage = (id) => api.delete(`/gallery/${id}`).then((res) => res.data)

export const reorderGalleryImages = (order) =>
  api.patch('/gallery/reorder', { order }).then((res) => res.data)

