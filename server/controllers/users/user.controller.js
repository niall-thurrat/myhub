/**
 * User controller
 *
 * @author Niall Thurrat
 * @version 1.0.0
 */

import User from '../../models/user.model'
import createError from 'http-errors'

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
  * Edit user (only gitlabId + token at present)
  * Handling POST requests to endpoint /api/users/:username
  *
  * @param {Object} req
  * @param {Object} res
  * @param {Function} next - Next middleware func
  * @response success gives 200 OK with JSON body
  *
  */
userController.edit = (req, res, next) => {
  try {
    const username = req.user.username
    const token = req.body.gitlabToken

    // update token for future GitLab API requests
    if (token) {
      req.user.gitlabToken = token
    }

    const editData = {
      gitlabToken: token
    }

    for (const key in editData) {
      if (editData[key] === undefined) {
        delete editData[key]
      }
    }

    User.findOneAndUpdate({ username: username },
      { $set: editData }, { new: true }, (err, user) => {
        if (err) {
          return next(createError(404,
            'error finding user', err
          ))
        }
        const resBody = {
          edit_success: true,
          description: 'updated user data held by myHub '
        }

        res.status(200).json(resBody)
      })
  } catch (error) {
    next(error)
  }
}

export default userController
