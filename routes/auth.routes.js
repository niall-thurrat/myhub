import express from 'express'
import signupController from '../controllers/auth/signup.controller'
import loginController from '../controllers/auth/login.controller'

const authRouter = express.Router()

authRouter.post('/signup', signupController)
authRouter.post('/login', loginController)

export default authRouter
