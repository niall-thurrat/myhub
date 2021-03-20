/**
 * User controller
 *
 * @author Niall Thurrat
 * @version 1.0.0
 */

'use strict'

import User from '../../models/user.model'
// import fetch from 'node-fetch'
// import dotenv from 'dotenv'
// import createError from 'http-errors'

// dotenv.config()

// const URL = 'https://gitlab.lnu.se/api/v4/users/:gitlab-id'
// const TOKEN = process.env.GL_TOKEN

const userController = {}

/**
  * Get user
  * Handling GET requests to endpoint /api/users/:username
  *
  * @param {Object} req
  * @param {Object} res
  * @param {Function} next - Next middleware func
  * @response success gives 200 OK with JSON body
  *
  */
userController.get = async (req, res, next) => {
  const username = req.user.username
  const user = await User.findOne({ username })
    .select('-password')

  const resBody = {
    user: user,
    description: 'user data held by myHub '
  }

  res.status(200).json(resBody)
}

/**
  * Edit user
  * Handling POST requests to endpoint /api/users/:username
  *
  * @param {Object} req
  * @param {Object} res
  * @param {Function} next - Next middleware func
  * @response success gives 200 OK with JSON body
  *
  */
userController.edit = (req, res, next) => { // THIS FUNC WILL ONLY HAVE MYHUB REGISTRATION DATA UNITL THE GITLAB ID AND TOKEN ARE ENTERED
  // update gitlab id + token (instance might be good here too)
  // password, username, email edit should be handled here too
  const resBody = {
    user: 'no change'
  }

  res.status(200).json(resBody)
}

export default userController
