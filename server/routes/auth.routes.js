/**
 * Authentication routes
 *
 * @author Niall Thurrat
 * @version 1.0.0
 */

'use strict'

import express from 'express'
import authContoller from '../controllers/auth.controller'

const authRouter = express.Router()

authRouter.post('/signup', authContoller.signup)
authRouter.post('/login', authContoller.login)

export default authRouter
