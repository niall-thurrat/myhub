/**
 * Authentication routes
 *
 * @author Niall Thurrat
 * @version 1.0.0
 */

'use strict'

import express from 'express'
import signupContoller from '../controllers/auth/signup.controller'
import loginContoller from '../controllers/auth/login.controller'

const authRouter = express.Router()

authRouter.post('/signup', signupContoller)
authRouter.post('/login', loginContoller)

export default authRouter
