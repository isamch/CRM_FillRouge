import 'dotenv/config'
import mongoose from 'mongoose'
import Role from '../src/models/role.model.js'
import { USER_PERMISSIONS } from '../src/permissions/user.permission.js'
import { POST_PERMISSIONS } from '../src/permissions/post.permission.js'
import { ROLE_PERMISSIONS } from '../src/permissions/role.permission.js'

const all = [...Object.values(USER_PERMISSIONS), ...Object.values(POST_PERMISSIONS), ...Object.values(ROLE_PERMISSIONS)]

const roles = [
  {
    name: 'admin',
    permissions: all,
  },
  {
    name: 'moderator',
    permissions: [
      USER_PERMISSIONS.READ,
      POST_PERMISSIONS.READ,
      POST_PERMISSIONS.UPDATE,
      POST_PERMISSIONS.DELETE,
      ROLE_PERMISSIONS.READ,
    ],
  },
  {
    name: 'user',
    permissions: [
      USER_PERMISSIONS.READ,
      POST_PERMISSIONS.READ,
      POST_PERMISSIONS.CREATE,
    ],
  },
]

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI)
  console.log('✅ Connected to MongoDB')

  for (const role of roles) {
    await Role.findOneAndUpdate(
      { name: role.name },
      { $set: { permissions: role.permissions } },
      { upsert: true, new: true }
    )
    console.log(`✅ Seeded role: ${role.name} (${role.permissions.length} permissions)`)
  }

  await mongoose.disconnect()
  console.log('✅ Done — disconnected')
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err.message)
  process.exit(1)
})
