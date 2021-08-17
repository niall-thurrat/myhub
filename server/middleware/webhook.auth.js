import createError from 'http-errors'
import User from '../models/user.model'

/**
* GitLab webhook authentication middleware
*
* @param {Object} req - Request object
* @param {Object} res - Response object
* @param {Function} next - Next middleware func
*/
export const hookAuth = async (req, res, next) => {
  try {
    const regex = /\/api\/users\/(.+?)\//
    const username = req.originalUrl.match(regex)[1]
    const user = await User.findOne({ username })
    const hookSecret = req.get('X-Gitlab-Token')
    const projectId = req.body.project_id || req.body.project.id

    if (!user) {
      return next(createError(404, 'User not found'))
    } else {
      const isMatch = await user.compareHookSecret(hookSecret, projectId)

      if (isMatch) {
        req.user = user
        next()
      } else {
        return next(createError(401, 'Hook failed authentication'))
      }
    }
  } catch (error) {
    next(error)
  }
}
