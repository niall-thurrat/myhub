/**
 * The starting point of myHub server application.
 *
 * @author Niall Thurrat
 * @version 1.0.0
 */

'use strict'

import express from 'express'
import mongoose from './config/mongoose'
import passport from 'passport'
import passportConfig from './config/passport'
import bodyParser from 'body-parser'
import cors from 'cors'
import createError from 'http-errors'
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

// additional middleware
app.use(cors(corsOptions))
app.use(passport.initialize())
passportConfig(passport)
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(logger('dev'))

// routes
// app.use('/api', routes.root)
app.use('/api/auth', routes.auth)
app.use('/api/users/:username', passport.authenticate(
  'jwt', { session: false }), routes.user)
app.use('/api/hooks', routes.hook)

// catch 404 errors
app.use('*', (req, res, next) => next(createError(404)))

// custom error handler
app.use((error, req, res, next) => {
  const data = {
    status: error.status,
    message: error.message
  }
  if (app.settings.env === 'development') {
    data.stack = error.stack
  }
  res.status(error.status || 500)
  res.json(data)
})

// run server
app.listen(port, () => {
  console.log(`Server is running on port ${port}.`)
})
