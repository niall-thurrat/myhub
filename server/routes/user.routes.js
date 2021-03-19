/**
 * User routes
 *
 * @author Niall Thurrat
 * @version 1.0.0
 */

'use strict'

import express from 'express'
import userController from '../controllers/users/user.controller'

const router = express.Router()

router.route('/')
  .get(userController.get)
  .post(userController.edit)

export default router
