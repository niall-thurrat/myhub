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
    const commits = req.body.commits
    const commitsJson = { data: [] }

    // TODO handle if there are more than 20 commits in push

    commits.forEach(commit => {
      // relate commit object to its project
      commit.project_id = req.body.project_id
      // these 2 properties are created to make
      // webhook more consistent with API data
      commit.author_name = commit.author.name
      commit.created_at = commit.timestamp

      commitsJson.data.push(commit)
    })

    emitter.emit('pushHook', commitsJson)
    res.status(200).send('thanks for the hook!')
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
  try {
    const release = req.body
    const releaseJson = { data: [release] }

    // TODO handle if there are more than 20 commits in push

    releaseJson.data.forEach(release => {
      // these 2 properties are created to make
      // webhook more consistent with API data
      release.project_id = release.project.id
      release.tag_name = release.tag
    })

    emitter.emit('releaseHook', releaseJson)
    res.status(200).send('thanks for the hook!')
  } catch (error) {
    next(error)
  }
}

export default hookController
