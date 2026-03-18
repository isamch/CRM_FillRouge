import QRCode from 'qrcode'
import * as sessionManager from './whatsapp/sessionManager.js'

export const connect = async (userId) => {
  sessionManager.createClient(userId.toString())
  return { message: 'WhatsApp client initializing' }
}

export const getQR = async (userId) => {
  const qr = sessionManager.getQR(userId.toString())
  if (!qr) return null
  const qrImage = await QRCode.toDataURL(qr)
  return qrImage
}

export const getStatus = (userId) => {
  return sessionManager.getStatus(userId.toString())
}

export const disconnect = async (userId) => {
  await sessionManager.destroyClient(userId.toString())
}
