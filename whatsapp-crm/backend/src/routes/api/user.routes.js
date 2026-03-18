import { Router } from 'express'
import { protect } from '#middlewares/auth.middleware.js'
import { hasPermission } from '#middlewares/permission.middleware.js'
import { validate } from '#middlewares/validate.middleware.js'
import { createUserSchema } from '#validations/user.validation/createUser.validation.js'
import { updateUserSchema } from '#validations/user.validation/updateUser.validation.js'
import { getUserByIdSchema } from '#validations/user.validation/getUserById.validation.js'
import { deleteUserSchema } from '#validations/user.validation/deleteUser.validation.js'
import * as UserController from '#controllers/user.controller.js'

const router = Router()

router.use(protect)

router.get('/', hasPermission('users:read'), UserController.getAllUsers)
router.get('/:id', validate(getUserByIdSchema), hasPermission('users:read'), UserController.getUser)
router.post('/', validate(createUserSchema), hasPermission('users:create'), UserController.createUser)
router.patch('/:id', validate(updateUserSchema), hasPermission('users:update'), UserController.updateUser)
router.delete('/:id', validate(deleteUserSchema), hasPermission('users:delete'), UserController.deleteUser)

export default router
