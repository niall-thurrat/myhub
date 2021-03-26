/**
 * User controller
 * @author Niall Thurrat
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
    // TODO email and name should be changeable
    // TODO password change must be managed
    const username = req.user.username
    const token = req.body.gitlabToken
    const url = req.body.gitlabInstanceUrl
    const id = req.body.gitlabId

    // updates token for future GitLab API requests
    if (token) req.user.gitlabToken = token

    const editData = {
      gitlabToken: token,
      gitlabInstanceUrl: url,
      gitlabId: id
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
        } // TODO handle if no data changes
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
