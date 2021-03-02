import express from 'express'
import bodyParser from 'body-parser'

import { routes } from './routes'

const app = express()

// middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// routes
app.use('/', routes.home)
app.use('/test', routes.test)

// Run Server
app.listen(8080, () => {
  console.log('Server is running on port 8080!')
})
