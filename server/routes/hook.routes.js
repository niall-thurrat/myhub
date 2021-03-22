/**
 * Webhook routes
 * @author Niall Thurrat
 */

import express from 'express'
import hookController from '../controllers/hooks/hook.controller'

const hookRouter = express.Router()

hookRouter.post('/', hookController)

export default hookRouter
