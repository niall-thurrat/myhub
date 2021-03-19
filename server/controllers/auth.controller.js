/**
 * Auth controller
 *
 * @author Niall Thurrat
 * @version 1.0.0
 *
 */

'use strict'

import User from '../models/user.model'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const authController = {}

/**
  * User Signup
  * Handling POST requests to endpoint /api/auth/signup
  *
  * @param {Object} req
  * @param {Object} res
  *
  */
authController.signup = async (req, res) => {
  console.log('FIRING: authController.signup')
  try {
    const user = await User.findOne({ username: req.body.username })

    if (user) {
      console.log('Signup error:: Username Exists in Database.')
      return
    } else {
      const newUser = new User({
        name: req.body.name,
        username: req.body.username,
        emailAddress: req.body.emailAddress,
        password: req.body.password
      })

      newUser.save((err, newUser) => {
        if (err) {
          console.log('Save user error') // need next
        } else {
          res.status(201)
          res.setHeader('Content-Type', 'application/json')
          res.charset = 'utf-8'
          res.setHeader('Location',
              `https://${req.headers.host}/users/${newUser.username}`)

          const resBody = {
            signup_success: true,
            description: 'login required after signup.'
          }

          res.send(JSON.stringify(resBody))
        }
      })
    }
  } catch (error) {
    console.log(`caught error: ${error}`) // need next
  }
}

/**
  * User login
  * Handling POST requests to endpoint /api/auth/login
  *
  * @param {Object} req
  * @param {Object} res
  *
  */
authController.login = async (req, res) => {
  console.log('FIRING: authController.login')
  try {
    const username = req.body.username
    const password = req.body.password

    const user = await User.findOne({ username })

    if (!user) {
      console.log('Signup error:: No Account Found.') // need next
      return
    } else {
      const isMatch = await user.comparePassword(password)

      if (isMatch) {
        const payload = {
          id: user._id,
          name: user.name,
          username: user.username,
          emailAddress: user.emailAddress
        }

        jwt.sign(payload, process.env.AUTH_SECRET, { expiresIn: 7200 },
          (err, token) => {
            if (err) {
              console.log('Error signing JWT') // need next
              return
            }

            res.status(200)
            res.setHeader('Content-Type', 'application/hal+json')
            res.charset = 'utf-8'

            const resBody = {
              login_success: true,
              token: `Bearer ${token}`,
              logged_in_user: {
                id: user._id,
                username: user.username
              },
              description: 'use Bearer token in Authorization header ' +
              'to access user and group resources'
            }

            res.send(JSON.stringify(resBody))
          })
      } else {
        console.log('Credentials incorrect') // need next
        return
      }
    }
  } catch (error) {
    console.log(`caught error: ${error}`) // need next
  }
}

export default authController
