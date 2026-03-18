import asyncHandler        from '#utils/async-handler.js'
import { notFound }        from '#utils/app-error.js'
import { successResponse } from '#utils/api-response.js'
import * as TemplateService from '#services/template.service.js'

export const getAllTemplates = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query
  const { data, meta } = await TemplateService.findAll({ page: +page, limit: +limit })
  successResponse(res, 200, 'Templates fetched successfully', { templates: data, meta })
})

export const getTemplate = asyncHandler(async (req, res) => {
  const item = await TemplateService.findById(req.params.id)
  if (!item) throw notFound('Template not found')
  successResponse(res, 200, 'Template fetched successfully', { template: item })
})

export const createTemplate = asyncHandler(async (req, res) => {
  const item = await TemplateService.create(req.body)
  successResponse(res, 201, 'Template created successfully', { template: item })
})

export const updateTemplate = asyncHandler(async (req, res) => {
  const item = await TemplateService.updateById(req.params.id, req.body)
  if (!item) throw notFound('Template not found')
  successResponse(res, 200, 'Template updated successfully', { template: item })
})

export const deleteTemplate = asyncHandler(async (req, res) => {
  await TemplateService.deleteById(req.params.id)
  successResponse(res, 200, 'Template deleted successfully', null)
})
