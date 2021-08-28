import User from '../../models/user.model'
import createError from 'http-errors'
import updateViewsInDb from '../../lib/viewsDbUpdater'

const userController = {}

/**
  * Get user
  * GET /api/users/:username
  *
  * @param {Object} req
  * @param {Object} res
  * @param {Function} next
  */
userController.get = async (req, res, next) => {
  const username = req.user.username
  const user = await User.findOne({ username })
    .select('-password')

  const resBody = {
    user: user,
    description: 'user data held by myHub '
  }

  updateViewsInDb(req)
  res.status(200).json(resBody)
}

/**
  * Edit user (only gitlabId + token at present)
  * POST /api/users/:username
  *
  * @param {Object} req
  * @param {Object} res
  * @param {Function} next - Next middleware func
  * @response success gives 200 OK with JSON body
  *
  */
userController.edit = async (req, res, next) => {
  try {
    const username = req.user.username
    const url = req.body.gitlabInstanceUrl || req.user.gitlabInstanceUrl
    const name = req.body.name
    const email = req.body.email
    const token = req.body.gitlabToken

    updateViewsInDb(req)

    // updates token for future GitLab API requests
    if (token) req.user.gitlabToken = token

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
