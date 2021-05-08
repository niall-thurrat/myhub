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
userController.edit = async (req, res, next) => {
  try {
    // TODO password change must be managed
    const username = req.user.username
    const url = req.body.gitlabInstanceUrl || req.user.gitlabInstanceUrl
    const name = req.body.name
    const email = req.body.email
    const token = req.body.gitlabToken

    // updates token for future GitLab API requests
    if (token) req.user.gitlabToken = token

    // TODO checkTokenWorks = (next, groupsUrl, token)
    // and edit gitlabApiConnection property accordingly

    const editData = {
      name: name,
      email: email,
      gitlabToken: token,
      gitlabInstanceUrl: url
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

// TODO get below GitLab API connection check working - currently produces
// Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client

// /**
//   * Check if token enables access to a user's API data
//   *
//   * @param {Function} next - Next middleware func
//   * @param {String} groupsUrl - url to a user's groups through the GitLab API
//   * @param {String} token - GitLab Personal Access Token
//   * @returns {boolean}
//   *
//   */
// const checkTokenWorks = (next, groupsUrl, token) => {
//   fetch(groupsUrl, {
//     headers: { 'PRIVATE-TOKEN': token }
//   })
//     .then(res => {
//       console.log('FETCH SENT AND RES RECEIVED')
//       if (res.statusCode === 200) {
//         return true
//       } else {
//         return false
//       }
//     })
//     .catch(error => {
//       next(createError(error))
//     })
// }

export default userController
