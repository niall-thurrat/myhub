import User from '../../models/user.model'
import createError from 'http-errors'

/**
  * User signup controller
  * POST /api/auth/signup
  *
  * @param {Object} req
  * @param {Object} res
  * @param {Function} next
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
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
      })

      newUser.save((err, newUser) => {
        if (err) {
          console.error(err)
          return next(createError(400, err))
        } else {
          res.setHeader('Content-Type', 'application/json')
          res.charset = 'utf-8'
          res.setHeader('Location',
              `https://${req.headers.host}/users/${newUser.username}`)

          const resBody = {
            signup_success: true,
            description: 'login required after signup.'
          }

          res.status(201).json(resBody)
        }
      })
    }
  } catch (error) {
    next(error)
  }
}

export default signupController
