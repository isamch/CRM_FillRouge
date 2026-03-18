import { Router } from 'express'
import { hasPermission } from '#middlewares/permission.middleware.js'
import * as WhatsappController from '#controllers/whatsapp.controller.js'
import { WHATSAPP_PERMISSIONS } from '#permissions/whatsapp.permission.js'

const router = Router()

router.post('/connect', hasPermission(WHATSAPP_PERMISSIONS.CONNECT), WhatsappController.connect)
router.get('/qr', hasPermission(WHATSAPP_PERMISSIONS.READ_QR), WhatsappController.getQR)
router.get('/status', hasPermission(WHATSAPP_PERMISSIONS.READ_STATUS), WhatsappController.getStatus)
router.post('/disconnect', hasPermission(WHATSAPP_PERMISSIONS.DISCONNECT), WhatsappController.disconnect)

export default router
