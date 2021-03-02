/**
 * The starting point of the application.
 *
 * @author Niall Thurrat
 * @version 1.0.0
 */

'use strict'

import express from 'express'
import bodyParser from 'body-parser'
import mongoose from './config/mongoose'

import { routes } from './routes'

const app = express()
const logger = require('morgan')

// connect to mongoDB via mongoose
mongoose.run().catch(error => {
  console.error(error)
  process.exit(1)
})

// middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(logger('dev'))

// routes
app.use('/', routes.home)
app.use('/test', routes.test)

// Run Server
app.listen(8080, () => {
  console.log('Server is running on port 8080!')
})
