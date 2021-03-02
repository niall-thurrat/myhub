import express from 'express'
import bodyParser from 'body-parser'

import { routes } from './routes'

const app = express()
const logger = require('morgan')

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
