import pkg from 'whatsapp-web.js'
const { Client, LocalAuth } = pkg
import WhatsappSession from '#models/whatsapp-session.model.js'

const clients = new Map()
const qrCodes = new Map()
const statuses = new Map()

export const createClient = (userId) => {
  if (clients.has(userId)) return

  const client = new Client({
    authStrategy: new LocalAuth({ clientId: userId }),
    puppeteer: { args: ['--no-sandbox', '--disable-setuid-sandbox'] },
  })

  statuses.set(userId, 'qr_pending')

  client.on('qr', (qr) => {
    qrCodes.set(userId, qr)
    statuses.set(userId, 'qr_pending')
  })

  client.on('ready', async () => {
    statuses.set(userId, 'connected')
    qrCodes.delete(userId)
    await WhatsappSession.findOneAndUpdate(
      { userId },
      { status: 'connected', connectedAt: new Date() },
      { upsert: true }
    )
  })

  client.on('disconnected', async () => {
    statuses.set(userId, 'disconnected')
    clients.delete(userId)
    await WhatsappSession.findOneAndUpdate(
      { userId },
      { status: 'disconnected', disconnectedAt: new Date() },
      { upsert: true }
    )
  })

  client.initialize()
  clients.set(userId, client)
}

export const validatePhones = async (userId, listId) => {
  const client = getClient(userId)
  if (!client || getStatus(userId) !== 'connected') {
    throw new Error('WhatsApp is not connected')
  }

  const contacts = await (await import('#models/contact.model.js')).default.find({ userId, listId })

  let valid = 0, invalid = 0

  for (const contact of contacts) {
    try {
      const phone = contact.phone + '@c.us'
      const isRegistered = await client.isRegisteredUser(phone)
      contact.validationStatus = isRegistered ? 'valid' : 'invalid'
      await contact.save()
      isRegistered ? valid++ : invalid++
    } catch {
      invalid++
    }
  }

  return { total: contacts.length, valid, invalid }
}

export const getClient = (userId) => clients.get(userId)

export const getQR = (userId) => qrCodes.get(userId)

export const getStatus = (userId) => statuses.get(userId) || 'disconnected'

export const destroyClient = async (userId) => {
  const client = clients.get(userId)
  if (client) {
    await client.destroy()
    clients.delete(userId)
    qrCodes.delete(userId)
    statuses.set(userId, 'disconnected')
  }
}
