import { Router } from 'express'
import { hasPermission } from '#middlewares/permission.middleware.js'
import * as TemplateController from '#controllers/template.controller.js'

const router = Router()

router.get('/',       hasPermission('templates:read'),   TemplateController.getAllTemplates)
router.get('/:id',    hasPermission('templates:read'),   TemplateController.getTemplate)
router.post('/',      hasPermission('templates:create'), TemplateController.createTemplate)
router.patch('/:id',  hasPermission('templates:update'), TemplateController.updateTemplate)
router.delete('/:id', hasPermission('templates:delete'), TemplateController.deleteTemplate)

export default router
