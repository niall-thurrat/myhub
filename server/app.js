/**
 * The starting point of myHub server application.
 * @author Niall Thurrat
 */

import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import mongoose from './config/mongoose'
import passport from 'passport'
import passportConfig from './config/passport'
import bodyParser from 'body-parser'
import cors from 'cors'
import createError from 'http-errors'
import { routes } from './routes'
import emitter from './lib/emitter'
const logger = require('morgan')

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer)
const port = process.env.PORT || 8080

// connect to mongoDB via mongoose
mongoose.run().catch(error => {
  console.error(error)
  process.exit(1)
})

const corsOptions = {
  origin: 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE'
}

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
app.use('/api/users/:username', routes.user)

// websocket connection to client
io.on('connection', socket => {
  emitter.on('releaseHook', function (data) {
    socket.emit('releaseData', data)
  })

  emitter.on('pushHook', function (data) {
    socket.emit('commitData', data)
  })

  emitter.on('notification', function (data) {
    socket.emit('notesData', data)
  })
})

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
httpServer.listen(port, () => {
  console.log(`Server is running on port ${port}.`)
})
