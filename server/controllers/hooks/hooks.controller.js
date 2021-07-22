/**
 * Webhooks controller
 * @author Niall Thurrat
 */

import Notification from '../../models/notification.model'
import { removeUrlPath, checkNested } from '../../utils/utils'
import emitter from '../../lib/emitter'
import createError from 'http-errors'
import fetch from 'node-fetch'
require('dotenv').config()

const SLACK_URL = process.env.SLACK_URL

/**
   * GitLab webhook router function
   * Handling POST requests to endpoint /api/users/:username/hooks
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
  // TODO authenticate hook:
  //    - hook enpoint must contain myHub username
  //    - change url in GitLab hook settings
  //    - get user from db using username in req url
  //    - user model must change to hold secrets per project per group
  //    - group settings endpoint should update db with secret
  //    - check Secret token in X-Gitlab-Token HTTP header against db
  //    - SUCCESS = pass user as arg
  //    - FAIL = error 401 response

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
const handlePushHook = async (req, res, next) => {
  try {
    const commits = req.body.commits
    const commitsJson = { commits: [] }

    const note = createNotification(req.body)
    notificationAddedToDb(note)
    notifySlack(note)

    // TODO handle if there are more than 20 commits in push

    commits.forEach(commit => {
      // relate commit object to its project
      commit.project_id = req.body.project_id
      // these 2 properties are created to make
      // webhook more consistent with API data
      commit.author_name = commit.author.name
      commit.created_at = commit.timestamp

      commitsJson.commits.push(commit)
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
const handleReleaseHook = async (req, res, next) => {
  try {
    const release = req.body
    const releaseJson = { release: [release] }

    const note = createNotification(release)
    notificationAddedToDb(note)
    notifySlack(note)

    // TODO handle if there are more than 20 commits in push

    releaseJson.release.forEach(release => {
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
   * Creates a Notification json object
   *
   * @param {Object} data - GitLab webhook json object (req.body)
   * @return {Object} Notificaiton json
   */
const createNotification = data => {
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

  return notification
}

/**
   * Adds Notification to db then returns db Notification object
   *
   * @param {Notification} notification - object for db
   * @return {Notification} Notification object from db
   */
const notificationAddedToDb = (notification) => {
  notification.save().then((dbNote, err) => {
    // TODO these errors should be logged
    if (err) {
      console.error(err)
    } else {
      // TODO emitter should be made from main handling function
      // TODO are all users receiveing all notifications?
      // testing from multiple user accounts required
      emitter.emit('notification', dbNote)
    }
  })
}

/**
   * Sends a POST request to Slack with notification text
   *
   * @param {Notification} notification - A GitLab event notification object
   */
const notifySlack = notification => {
  const body = { text: doText(notification) }

  fetch(SLACK_URL, {
    headers: { 'Content-type': 'application/json' },
    method: 'POST',
    body: JSON.stringify(body)
  })
    .catch(err =>
      console.error(err)
    )
}

/**
   * Creates a gitlab event text using notification data
   *
   * @param {Notification} notification - A GitLab event notification object
   * @return {String} GitLab event text
   */
const doText = note => {
  switch (note.type) {
    case 'push':
      return `${note.gitlabCreatedBy} has pushed ` +
         `${note.pushCommitsCount} commits to ${note.gitlabProjectName}`

    case 'release':
      return `Release ${note.releaseTag} has been made for ` +
         note.gitlabProjectName

    default:
      return 'doText error'
  }
}

export default hookController
