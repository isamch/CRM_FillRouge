import asyncHandler        from '#utils/async-handler.js'
import { notFound }        from '#utils/app-error.js'
import { successResponse } from '#utils/api-response.js'
import * as UserService    from '#services/user.service.js'

export const getMe = asyncHandler(async (req, res) => {
  successResponse(res, 200, 'Profile fetched successfully', { user: req.user })
})

export const getAllUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query
  const { data, meta } = await UserService.findAll({ page: +page, limit: +limit })
  successResponse(res, 200, 'Users fetched successfully', { users: data, meta })
})

export const getUser = asyncHandler(async (req, res) => {
  const user = await UserService.findById(req.params.id)
  if (!user) throw notFound('User not found')
  successResponse(res, 200, 'User fetched successfully', { user })
})

export const createUser = asyncHandler(async (req, res) => {
  const user = await UserService.create(req.body)
  successResponse(res, 201, 'User created successfully', { user })
})

export const updateUser = asyncHandler(async (req, res) => {
  const user = await UserService.updateById(req.params.id, req.body)
  if (!user) throw notFound('User not found')
  successResponse(res, 200, 'User updated successfully', { user })
})

export const deleteUser = asyncHandler(async (req, res) => {
  await UserService.deleteById(req.params.id)
  successResponse(res, 200, 'User deleted successfully', null)
})
