/**
 * Groups routes
 *
 * @author Niall Thurrat
 * @version 1.0.0
 */

'use strict'

import express from 'express'
import groupsContoller from '../controllers/groups.controller'

const groupsRouter = express.Router()

// groupsRouter.get('/', groupsContoller.getAll)
groupsRouter.get('/list', groupsContoller.list)
groupsRouter.get('/:id', groupsContoller.get)
groupsRouter.get('/:id/commits', groupsContoller.getCommits)

export default groupsRouter
