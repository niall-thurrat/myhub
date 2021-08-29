import express from 'express'
import passport from 'passport'

import userController from '../controllers/users/user.controller'
import groupsController from '../controllers/groups/groups.controller'
import groupController from '../controllers/groups/group.controller'
import commitsController from '../controllers/groups/commits.controller'
import releasesController from '../controllers/groups/releases.controller'
import notificationsController from '../controllers/groups/notifications.controller'
import notificationController from '../controllers/groups/notification.controller'
import settingsController from '../controllers/groups/settings.controller'
import slackTestController from '../controllers/groups/slack-test.controller'
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
userRouter.route('/groups/:id/notifications')
  .get(userAuth, notificationsController.get)
  .patch(userAuth, notificationsController.edit)
userRouter.patch('/groups/:id/notifications/:note_id', userAuth, notificationController)
userRouter.route('/groups/:id/settings')
  .get(userAuth, settingsController.get)
  .patch(userAuth, settingsController.edit)
userRouter.get('/groups/:id/settings/slack-test', userAuth, slackTestController)

userRouter.post('/hooks', hookAuth, hooksController)

export default userRouter
