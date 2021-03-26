/**
 * Login controller
 * @author Niall Thurrat
 */

import User from '../../models/user.model'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import createError from 'http-errors'

dotenv.config()

/**
   * User login controller
   * Handling POST requests to endpoint /api/auth/login
   *
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next - Next middleware func
   *
   */
const loginController = async (req, res, next) => {
  try {
    const username = req.body.username
    const password = req.body.password

    const user = await User.findOne({ username })

    if (!user) {
      return next(createError(401,
        'No Account Found'))
    } else {
      const isMatch = await user.comparePassword(password)

      if (isMatch) {
        const payload = {
          id: user._id,
          username: user.username,
          email: user.email
        }

        jwt.sign(payload, process.env.JWT_SECRET,
          { expiresIn: 7200 }, (err, token) => {
            if (err) {
              return next(createError(500,
                'Error signing JWT'))
            }

            // TODO add method to show all properties in user except password
            const resBody = {
              login_success: true,
              token: `Bearer ${token}`,
              user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                name: user.name,
                gitlabUsername: user.gitlabUsername,
                gitlabToken: user.gitlabToken,
                gitlabInstanceUrl: user.gitlabInstanceUrl,
                gitlabId: user.gitlabId
              },
              description: 'use Bearer token in Authorization ' +
               'header to access user and group resources'
            }

            res.setHeader('Content-Type', 'application/json')
            res.charset = 'utf-8'

            res.status(200).json(resBody)
          })
      } else {
        return next(createError(401,
          'Credentials incorrect'))
      }
    }
  } catch (error) {
    next(error)
  }
}

export default loginController
