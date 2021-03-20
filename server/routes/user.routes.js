/**
 * User routes
 *
 * @author Niall Thurrat
 * @version 1.0.0
 */

'use strict'

import express from 'express'

import userController from '../controllers/users/user.controller'
import groupsController from '../controllers/groups/groups.controller'
import groupController from '../controllers/groups/group.controller'
import commitsController from '../controllers/groups/commits.controller'

export const userRouter = express.Router()

userRouter.route('/')
  .get(userController.get)
  .patch(userController.edit)

// userRouter.get('/', groupsContoller.getAll)
userRouter.get('/groups', groupsController)
userRouter.get('/groups/:id', groupController)
userRouter.get('/groups/:id/commits', commitsController)
