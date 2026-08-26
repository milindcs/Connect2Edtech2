import api from './axios'

export const submitTrainerApplication = (payload) =>
  api.post('/trainer-application', payload).then((res) => res.data)
