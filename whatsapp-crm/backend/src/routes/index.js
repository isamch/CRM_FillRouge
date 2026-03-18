import { Router } from 'express'
import { protect, checkIsActive } from '#middlewares/auth.middleware.js'
import authRoutes from './api/auth.routes.js'
import userRoutes from './api/user.routes.js'
import roleRoutes from './api/role.routes.js'
import userPermissionRoutes from './api/user-permission.routes.js'
// NEW_ROUTE_IMPORT

const router = Router()

router.use('/auth', authRoutes)

router.use(protect, checkIsActive)

router.use('/users', userRoutes)
router.use('/roles', roleRoutes)
router.use('/users/:id', userPermissionRoutes)
// NEW_ROUTE_USE

export default router
