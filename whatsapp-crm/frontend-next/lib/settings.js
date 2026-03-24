import api from './api'

export const updateProfile   = (data)                          => api.patch('/users/me', data)
export const changePassword  = (currentPassword, newPassword)  => api.patch('/users/me/password', { currentPassword, newPassword })
