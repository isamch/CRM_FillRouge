import { Router } from 'express'
import {
  createCampaign, getCampaigns, getCampaignById,
  updateCampaign, deleteCampaign,
  runCampaignCtrl, pauseCampaignCtrl, resumeCampaignCtrl,
  stopCampaignCtrl, scheduleCampaignCtrl, getCampaignLogs,
} from '#controllers/campaign.controller.js'

const router = Router()

router.route('/').get(getCampaigns).post(createCampaign)
router.route('/:id').get(getCampaignById).patch(updateCampaign).delete(deleteCampaign)
router.post('/:id/run', runCampaignCtrl)
router.post('/:id/pause', pauseCampaignCtrl)
router.post('/:id/resume', resumeCampaignCtrl)
router.post('/:id/stop', stopCampaignCtrl)
router.post('/:id/schedule', scheduleCampaignCtrl)
router.get('/:id/logs', getCampaignLogs)

export default router
