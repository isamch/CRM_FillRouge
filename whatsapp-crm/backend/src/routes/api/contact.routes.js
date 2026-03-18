import { Router } from 'express'
import { hasPermission } from '#middlewares/permission.middleware.js'
import * as ContactController from '#controllers/contact.controller.js'
import { CONTACT_PERMISSIONS } from '#permissions/contact.permission.js'

const router = Router()

router.get('/', hasPermission(CONTACT_PERMISSIONS.READ), ContactController.getAllContacts)
router.post('/', hasPermission(CONTACT_PERMISSIONS.CREATE), ContactController.createContact)
router.patch('/:id', hasPermission(CONTACT_PERMISSIONS.UPDATE), ContactController.updateContact)
router.delete('/:id', hasPermission(CONTACT_PERMISSIONS.DELETE), ContactController.deleteContact)

export default router
