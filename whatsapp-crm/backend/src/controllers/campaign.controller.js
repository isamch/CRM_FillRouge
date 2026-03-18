import asyncHandler from '#utils/async-handler.js'
import { successResponse } from '#utils/api-response.js'
import { notFound, badRequest } from '#utils/app-error.js'
import * as campaignService from '#services/campaign.service.js'
import { runCampaign, pauseCampaign, resumeCampaign, stopCampaign } from '#services/campaignEngine.js'

export const createCampaign = asyncHandler(async (req, res) => {
  const campaign = await campaignService.createCampaign(req.user._id, req.body)
  successResponse(res, 201, 'Campaign created', campaign)
})

export const getCampaigns = asyncHandler(async (req, res) => {
  const result = await campaignService.getCampaigns(req.user._id, req.query)
  successResponse(res, 200, 'Campaigns fetched', result)
})

export const getCampaignById = asyncHandler(async (req, res) => {
  const campaign = await campaignService.getCampaignById(req.user._id, req.params.id)
  if (!campaign) throw notFound('Campaign not found')
  successResponse(res, 200, 'Campaign fetched', campaign)
})

export const updateCampaign = asyncHandler(async (req, res) => {
  const campaign = await campaignService.updateCampaign(req.user._id, req.params.id, req.body)
  if (!campaign) throw notFound('Campaign not found or cannot be updated')
  successResponse(res, 200, 'Campaign updated', campaign)
})

export const deleteCampaign = asyncHandler(async (req, res) => {
  const campaign = await campaignService.deleteCampaign(req.user._id, req.params.id)
  if (!campaign) throw notFound('Campaign not found or cannot be deleted')
  successResponse(res, 200, 'Campaign deleted', null)
})

export const runCampaignCtrl = asyncHandler(async (req, res) => {
  await runCampaign(req.params.id, req.user._id.toString())
  successResponse(res, 200, 'Campaign started', null)
})

export const pauseCampaignCtrl = asyncHandler(async (req, res) => {
  await pauseCampaign(req.params.id, req.user._id.toString())
  successResponse(res, 200, 'Campaign paused', null)
})

export const resumeCampaignCtrl = asyncHandler(async (req, res) => {
  await resumeCampaign(req.params.id, req.user._id.toString())
  successResponse(res, 200, 'Campaign resumed', null)
})

export const stopCampaignCtrl = asyncHandler(async (req, res) => {
  await stopCampaign(req.params.id, req.user._id.toString())
  successResponse(res, 200, 'Campaign stopped', null)
})

export const scheduleCampaignCtrl = asyncHandler(async (req, res) => {
  const { scheduledAt } = req.body
  if (!scheduledAt) throw badRequest('scheduledAt is required')
  const campaign = await campaignService.scheduleCampaign(req.user._id, req.params.id, new Date(scheduledAt))
  if (!campaign) throw notFound('Campaign not found or cannot be scheduled')
  successResponse(res, 200, 'Campaign scheduled', campaign)
})

export const getCampaignLogs = asyncHandler(async (req, res) => {
  const result = await campaignService.getCampaignLogs(req.params.id, req.user._id, req.query)
  if (!result) throw notFound('Campaign not found')
  successResponse(res, 200, 'Campaign logs fetched', result)
})
