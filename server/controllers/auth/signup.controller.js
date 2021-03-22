/**
 * Signup controller
 *
 * @author Niall Thurrat
 * @version 1.0.0
 *
 */

import User from '../../models/user.model'
import createError from 'http-errors'

/**
  * User signup controller
  * Handling POST requests to endpoint /api/auth/signup
  *
  * @param {Object} req
  * @param {Object} res
  * @param {Function} next - Next middleware func
  *
  */
const signupController = async (req, res, next) => {
  try {
    const user = await User.findOne({
      username: req.body.username
    })

    if (user) {
      return next(createError(400,
        'Username Exists in Database.'
      ))
    } else {
      const newUser = new User({
        name: req.body.name,
        username: req.body.username,
        emailAddress: req.body.emailAddress,
        password: req.body.password
      })

      newUser.save((err, newUser) => {
        if (err) {
          return next(createError(400, err))
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
    next(error)
  }
}

export default signupController
