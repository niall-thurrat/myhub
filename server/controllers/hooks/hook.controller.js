/**
 * Webhooks controller
 * @author Niall Thurrat
 */

import Notification from '../../models/notification.model'
import { removeUrlPath, checkNested } from '../../utils/utils'
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

    addNotificationToDb(req.body)

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

    addNotificationToDb(release)

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

/**
   * Generates and adds a notification to the database
   *
   * @param {Object} req - request object
   * @param {Object} res - response object
   * @param {Function} next - Next middleware func
   */
const addNotificationToDb = (data) => {
  const projectUrl = data.project.web_url
  let createdBy = null

  // get gitlab username in different webhook data stuctures, if applicable
  if (checkNested(data, 'user_username')) {
    createdBy = data.user_username
  } else if (checkNested(data, 'user', 'username')) {
    createdBy = data.user.username
  }

  // get gitlab createdAt if applicable
  const createdAt = checkNested(data, 'created_at')
    ? data.created_at : null

  // get gitlab push total_commits_count if applicable
  const pushCommitsCount = checkNested(data, 'total_commits_count')
    ? data.total_commits_count : null

  // get gitlab release tag if applicable
  const releaseTag = checkNested(data, 'tag')
    ? data.tag : null

  const notification = new Notification({
    gitlabProjectId: data.project.id,
    gitlabProjectName: data.project.name,
    type: data.object_kind,
    gitlabCreatedAt: createdAt,
    gitlabCreatedBy: createdBy,
    gitlabInstanceUrl: removeUrlPath(projectUrl),
    pushCommitsCount: pushCommitsCount,
    releaseTag: releaseTag
  })

  notification.save(err => {
    // TODO these errors should be logged
    if (err) {
      console.error(err)
    }
  })
}

export default hookController
