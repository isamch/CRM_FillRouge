import { Router }            from 'express'
import { protect }           from '#middlewares/auth.middleware.js'
import { hasPermission }     from '#middlewares/permission.middleware.js'
import { validate }          from '#middlewares/validate.middleware.js'
import { createTemplateSchema }  from '#validations/template.validation/createTemplate.validation.js'
import { updateTemplateSchema }  from '#validations/template.validation/updateTemplate.validation.js'
import { getTemplateByIdSchema } from '#validations/template.validation/getTemplateById.validation.js'
import { deleteTemplateSchema }  from '#validations/template.validation/deleteTemplate.validation.js'
import * as TemplateController   from '#controllers/template.controller.js'

const router = Router()

router.use(protect)

router.get('/',       hasPermission('templates:read'),                                    TemplateController.getAllTemplates)
router.get('/:id',    validate(getTemplateByIdSchema), hasPermission('templates:read'),   TemplateController.getTemplate)
router.post('/',      validate(createTemplateSchema),  hasPermission('templates:create'), TemplateController.createTemplate)
router.patch('/:id',  validate(updateTemplateSchema),  hasPermission('templates:update'), TemplateController.updateTemplate)
router.delete('/:id', validate(deleteTemplateSchema),  hasPermission('templates:delete'), TemplateController.deleteTemplate)

export default router
