import asyncHandler from '#utils/async-handler.js'
import { successResponse } from '#utils/api-response.js'
import { badRequest } from '#utils/app-error.js'
import * as ContactService from '#services/contact.service.js'

export const getAllContacts = asyncHandler(async (req, res) => {
  const { listId, page, limit } = req.query
  if (!listId) throw badRequest('listId is required')
  const result = await ContactService.findAll(req.user._id, listId, { page, limit })
  successResponse(res, 200, 'Contacts fetched', result)
})

export const createContact = asyncHandler(async (req, res) => {
  const contact = await ContactService.create(req.user._id, req.body)
  successResponse(res, 201, 'Contact created', { contact })
})

export const updateContact = asyncHandler(async (req, res) => {
  const contact = await ContactService.updateById(req.user._id, req.params.id, req.body)
  successResponse(res, 200, 'Contact updated', { contact })
})

export const deleteContact = asyncHandler(async (req, res) => {
  await ContactService.deleteById(req.user._id, req.params.id)
  successResponse(res, 200, 'Contact deleted', null)
})
