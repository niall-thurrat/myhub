/**
 * Webhooks controller
 * @author Niall Thurrat
 */

import emitter from '../../lib/emitter'
import createError from 'http-errors'

/**
   * GitLab webhook router function
   * Handling POST requests to endpoint /api/hooks
   *
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next - Next middleware func
   *
   */
const hookController = (req, res, next) => {
  const header = 'X-Gitlab-Event'
  const hookType = req.header(header)

  // TODO handle no header
  // TODO authenticate hook

  switch (hookType) {
    case 'Push Hook':
      handlePushHook(req, res, next)
      break

    case 'Release Hook':
      handleReleaseHook(req, res, next)
      break

    default:
      return next(createError(400,
        'Hook request error'
      ))
  }
}

/**
   * GitLab webhook handler for Push Events
   *
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next - Next middleware func
   *
   */
const handlePushHook = (req, res, next) => {
  try {
    const projectId = req.body.project_id
    const commits = req.body.commits

    // TODO handle if there are more than 20 commits in push

    const data = {
      projectId: projectId,
      commits: commits
    }

    emitter.emit('pushHook', data)
    res.status(200) // TODO emit event here - remove response json
  } catch (error) {
    next(error)
  }
}

/**
   * GitLab webhook handler for Release Events
   *
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next - Next middleware func
   *
   */
const handleReleaseHook = (req, res, next) => {
  const data = {
    id: req.body.id,
    description: req.body.description,
    name: req.body.name
  }

  emitter.emit('releaseHook', data)
  res.status(200)
}

export default hookController
