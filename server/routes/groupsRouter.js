/**
 * Groups routes
 *
 * @author Niall Thurrat
 * @version 1.0.0
 */

'use strict'

import express from 'express'
import groupsContoller from '../controllers/groups'

const groupsRouter = express.Router()

groupsRouter.get('/', groupsContoller.all)
groupsRouter.get('/list', groupsContoller.list)

export default groupsRouter
