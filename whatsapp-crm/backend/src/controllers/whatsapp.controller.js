import asyncHandler from '#utils/async-handler.js'
import { successResponse } from '#utils/api-response.js'
import { notFound } from '#utils/app-error.js'
import * as WhatsappService from '#services/whatsapp.service.js'

export const connect = asyncHandler(async (req, res) => {
  const result = await WhatsappService.connect(req.user._id)
  successResponse(res, 200, result.message, null)
})

export const getQR = asyncHandler(async (req, res) => {
  const qrImage = await WhatsappService.getQR(req.user._id)
  if (!qrImage) throw notFound('QR code not available yet')
  successResponse(res, 200, 'QR code fetched', { qr: qrImage })
})

export const getStatus = asyncHandler(async (req, res) => {
  const status = WhatsappService.getStatus(req.user._id)
  successResponse(res, 200, 'Status fetched', { status })
})

export const disconnect = asyncHandler(async (req, res) => {
  await WhatsappService.disconnect(req.user._id)
  successResponse(res, 200, 'Disconnected successfully', null)
})
