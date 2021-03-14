/**
 * The starting point of the application.
 *
 * @author Niall Thurrat
 * @version 1.0.0
 */

'use strict'

import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from './config/mongoose'
import { routes } from './routes'

const app = express()

const corsOptions = {
  origin: [
    'http://localhost:3000',
    /\.gitlab\.lnu\.se$/
  ]
}

const PORT = process.env.PORT || 8080
const logger = require('morgan')

// connect to mongoDB via mongoose
mongoose.run().catch(error => {
  console.error(error)
  process.exit(1)
})

// middleware
app.use(cors(corsOptions))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(logger('dev'))

// routes
app.use('/api', routes.root)
app.use('/api/groups', routes.groups)

// Run Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`)
})
