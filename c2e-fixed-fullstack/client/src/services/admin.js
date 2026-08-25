import api from './axios';

export const getTrainers = (params) =>
  api.get('/trainers', { params }).then((res) => res.data);

export const getTrainerById = (id) =>
  api.get(`/trainers/${id}`).then((res) => res.data);

export const createTrainer = (formData) =>
  api.post('/trainers', formData).then((res) => res.data);

export const updateTrainer = (id, payload) =>
  api.put(`/trainers/${id}`, payload).then((res) => res.data);

export const deleteTrainer = (id) =>
  api.delete(`/trainers/${id}`).then((res) => res.data);

export const getSettings = () =>
  api.get('/settings').then((res) => res.data);

export const updateSettings = (payload) =>
  api.put('/settings', payload).then((res) => res.data);

export const getAdminUsers = (params) =>
  api.get('/admin/users', { params }).then((res) => res.data);

export const deleteAdminUser = (id) =>
  api.delete(`/admin/users/${id}`).then((res) => res.data);

export const getDashboardAnalytics = () =>
  api.get('/dashboard/analytics').then((res) => res.data);

