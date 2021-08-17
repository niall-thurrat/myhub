import express from 'express'
import passport from 'passport'

import userController from '../controllers/users/user.controller'
import groupsController from '../controllers/groups/groups.controller'
import groupController from '../controllers/groups/group.controller'
import commitsController from '../controllers/groups/commits.controller'
import releasesController from '../controllers/groups/releases.controller'
import notificationsController from '../controllers/groups/notifications.controller'
import settingsController from '../controllers/groups/settings.controller'
import hooksController from '../controllers/hooks/hooks.controller'

import { hookAuth } from '../middleware/webhook.auth'

const userRouter = express.Router()
const userAuth = passport.authenticate('jwt', { session: false })

userRouter.route('/')
  .get(userAuth, userController.get)
  .patch(userAuth, userController.edit)

userRouter.get('/groups', userAuth, groupsController)
userRouter.get('/groups/:id', userAuth, groupController)
userRouter.get('/groups/:id/commits', userAuth, commitsController)
userRouter.get('/groups/:id/releases', userAuth, releasesController)
userRouter.get('/groups/:id/notifications', userAuth, notificationsController)
userRouter.route('/groups/:id/settings')
  .get(userAuth, settingsController.get)
  .patch(userAuth, settingsController.edit)

userRouter.post('/hooks', hookAuth, hooksController)

export default userRouter
