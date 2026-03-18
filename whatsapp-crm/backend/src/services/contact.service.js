import Contact from '#models/contact.model.js'
import ContactList from '#models/contact-list.model.js'
import { notFound, conflict } from '#utils/app-error.js'
import { paginate } from '#utils/pagination.js'

export const findAll = async (userId, listId, { page = 1, limit = 20 } = {}) => {
  const { skip, meta } = paginate({ page, limit })
  const filter = { userId, listId }
  const [data, total] = await Promise.all([
    Contact.find(filter).skip(skip).limit(limit).lean(),
    Contact.countDocuments(filter),
  ])
  return { data, meta: { ...meta, total } }
}

export const create = async (userId, body) => {
  const existing = await Contact.findOne({ listId: body.listId, phone: body.phone })
  if (existing) throw conflict('Phone number already exists in this list')

  const contact = await Contact.create({ userId, ...body })
  await ContactList.findByIdAndUpdate(body.listId, { $inc: { contactCount: 1 } })
  return contact
}

export const updateById = async (userId, id, body) => {
  const contact = await Contact.findOne({ _id: id, userId })
  if (!contact) throw notFound('Contact not found')
  return Contact.findByIdAndUpdate(id, body, { new: true }).lean()
}

export const deleteById = async (userId, id) => {
  const contact = await Contact.findOne({ _id: id, userId })
  if (!contact) throw notFound('Contact not found')
  await Contact.findByIdAndDelete(id)
  await ContactList.findByIdAndUpdate(contact.listId, { $inc: { contactCount: -1 } })
}
