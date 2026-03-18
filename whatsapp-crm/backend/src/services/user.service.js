import User              from '#models/user.model.js'
import { hashPassword }  from '#utils/hashing.js'
import { paginate }      from '#utils/pagination.js'

export const findAll = async ({ page = 1, limit = 20 } = {}) => {
  const { skip, meta } = paginate({ page, limit })
  const [data, total]  = await Promise.all([
    User.find().skip(skip).limit(limit).lean(),
    User.countDocuments(),
  ])
  return { data, meta: { ...meta, total } }
}

export const findById = async (id) => User.findById(id).lean()

export const create = async (body) => {
  const hashed = await hashPassword(body.password)
  return User.create({ ...body, password: hashed })
}

export const updateById = async (id, body) => {
  if (body.password) body.password = await hashPassword(body.password)
  return User.findByIdAndUpdate(id, body, { new: true, runValidators: true }).lean()
}

export const deleteById = async (id) => User.findByIdAndDelete(id)
