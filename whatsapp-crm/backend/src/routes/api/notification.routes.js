import { Router } from 'express'
import {
  sendNotification, getInbox, getUnreadCount,
  markAsRead, markAllAsRead, deleteNotification, getSent,
} from '#controllers/notification.controller.js'

const router = Router()

router.post('/', sendNotification)
router.get('/inbox', getInbox)
router.get('/unread-count', getUnreadCount)
router.get('/sent', getSent)
router.patch('/read-all', markAllAsRead)
router.patch('/:id/read', markAsRead)
router.delete('/:id', deleteNotification)

export default router
