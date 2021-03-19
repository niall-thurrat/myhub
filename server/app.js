/**
 * The starting point of myHub server application.
 *
 * @author Niall Thurrat
 * @version 1.0.0
 */

'use strict'

import express from 'express'
import passport from 'passport'
import passportConfig from './config/passport'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from './config/mongoose'
import { routes } from './routes'
const logger = require('morgan')

const app = express()
const port = process.env.PORT || 8080
const corsOptions = {
  origin: 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE'
}

// connect to mongoDB via mongoose
mongoose.run().catch(error => {
  console.error(error)
  process.exit(1)
})

// middleware
app.use(cors(corsOptions))
app.use(passport.initialize())
passportConfig(passport)
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(logger('dev'))

// routes
// app.use('/api', routes.root)
app.use('/api/auth', routes.auth)
app.use('/api/users/:username/groups', passport.authenticate(
  'jwt', { session: false }), routes.groups)

// run server
app.listen(port, () => {
  console.log(`Server is running on port ${port}.`)
})
