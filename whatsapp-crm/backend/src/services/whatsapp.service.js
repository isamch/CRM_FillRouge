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

export const getConversations = async (userId) => {
  const client = sessionManager.getClient(userId.toString())
  if (!client || sessionManager.getStatus(userId.toString()) !== 'connected') return []
  const chats = await client.getChats()
  return chats.slice(0, 50).map(chat => ({
    id: chat.id._serialized,
    name: chat.name,
    lastMessage: chat.lastMessage?.body || '',
    lastMessageTime: chat.lastMessage?.timestamp ? new Date(chat.lastMessage.timestamp * 1000) : null,
    unreadCount: chat.unreadCount,
    isGroup: chat.isGroup,
  }))
}

export const getMessages = async (userId, chatId, { page = 1, limit = 30 } = {}) => {
  const client = sessionManager.getClient(userId.toString())
  if (!client || sessionManager.getStatus(userId.toString()) !== 'connected') return { data: [], meta: {} }
  const chat = await client.getChatById(chatId)
  const messages = await chat.fetchMessages({ limit: limit * page })
  const paginated = messages.slice(-limit * page, messages.length - limit * (page - 1) || undefined)
  return {
    data: paginated.map(m => ({
      id: m.id._serialized,
      body: m.body,
      fromMe: m.fromMe,
      timestamp: new Date(m.timestamp * 1000),
      author: m.author || null,
    })),
    meta: { page: +page, limit: +limit }
  }
}

export const sendMessage = async (userId, chatId, body) => {
  const client = sessionManager.getClient(userId.toString())
  if (!client || sessionManager.getStatus(userId.toString()) !== 'connected') {
    throw new Error('WhatsApp is not connected')
  }
  const msg = await client.sendMessage(chatId, body)
  return {
    id: msg.id._serialized,
    body: msg.body,
    fromMe: true,
    timestamp: new Date(msg.timestamp * 1000),
  }
}
