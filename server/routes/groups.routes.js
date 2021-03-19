/**
 * Groups routes
 *
 * @author Niall Thurrat
 * @version 1.0.0
 */

'use strict'

import express from 'express'
import groupsContoller from '../controllers/groups/groups.controller'
import groupContoller from '../controllers/groups/group.controller'
import commitsContoller from '../controllers/groups/commits.controller'

const groupsRouter = express.Router()

// groupsRouter.get('/', groupsContoller.getAll)
groupsRouter.get('/', groupsContoller)
groupsRouter.get('/:id', groupContoller)
groupsRouter.get('/:id/commits', commitsContoller)

export default groupsRouter
