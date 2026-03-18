import { Router } from 'express'
import multer from 'multer'
import { hasPermission } from '#middlewares/permission.middleware.js'
import * as ContactController from '#controllers/contact.controller.js'
import { CONTACT_PERMISSIONS } from '#permissions/contact.permission.js'

const router = Router()
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 2 * 1024 * 1024 } })

router.get('/', hasPermission(CONTACT_PERMISSIONS.READ), ContactController.getAllContacts)
router.post('/', hasPermission(CONTACT_PERMISSIONS.CREATE), ContactController.createContact)
router.post('/import', hasPermission(CONTACT_PERMISSIONS.CREATE), upload.single('file'), ContactController.importContacts)
router.patch('/:id', hasPermission(CONTACT_PERMISSIONS.UPDATE), ContactController.updateContact)
router.delete('/:id', hasPermission(CONTACT_PERMISSIONS.DELETE), ContactController.deleteContact)

export default router
