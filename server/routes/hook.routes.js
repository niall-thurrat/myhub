/**
 * Webhook routes
 *
 * @author Niall Thurrat
 * @version 1.0.0
 */

'use strict'

import express from 'express'
import hookController from '../controllers/hooks/hook.controller'

const hookRouter = express.Router()

hookRouter.post('/', hookController)

export default hookRouter