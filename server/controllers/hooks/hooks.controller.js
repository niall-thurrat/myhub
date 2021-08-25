import Notification from '../../models/notification.model'
import { removeUrlPath, checkNested } from '../../utils/utils'
import emitter from '../../lib/emitter'
import createError from 'http-errors'
import fetch from 'node-fetch'

/**
  * GitLab webhook router function
  * POST /api/users/:username/hooks
  *
  * @param {Object} req - Request object
  * @param {Object} res - Response object
  * @param {Function} next - Next middleware func
  */
const hookController = async (req, res, next) => {
  const hookType = req.header('X-Gitlab-Event')

  switch (hookType) {
    case 'Push Hook':
      handlePushHook(req, res, next)
      break

    case 'Release Hook':
      handleReleaseHook(req, res, next)
      break

    default:
      return next(createError(400,
        'Unsupported X-Gitlab-Event header used'
      ))
  }
}

/**
  * GitLab webhook handler for Push Events
  *
  * @param {Object} req - Request object
  * @param {Object} res - Response object
  * @param {Function} next - Next middleware func
  *
  */
const handlePushHook = async (req, res, next) => {
  try {
    const user = req.user
    const commits = req.body.commits
    const commitsJson = { commits: [] }

    const note = createNotification(req)
    addNotificationToDb(note)
    notifySlack(note, user)

    // TODO handle if there are more than 20 commits in push

    commits.forEach(commit => {
      // relate commit object to its project
      commit.project_id = req.body.project_id
      // makes webhook more consistent with API data
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
  * @param {Object} req - Request object
  * @param {Object} res - Response object
  * @param {Function} next - Next middleware func
  *
  */
const handleReleaseHook = async (req, res, next) => {
  try {
    const user = req.user
    const release = req.body
    const releaseJson = { release: [release] }

    const note = createNotification(req)
    addNotificationToDb(note)
    notifySlack(note, user)

    // TODO handle what to do with more than 20 releases

    releaseJson.release.forEach(release => {
      // makes webhook more consistent with API data
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
  * @param {Object} req - request object
  * @returns {Object} Notificaiton json
  */
const createNotification = req => {
  const hookData = req.body
  const username = req.user.username
  const projectUrl = hookData.project.web_url
  let createdBy = null

  // get gitlab username in different webhook data stuctures, if applicable
  if (checkNested(hookData, 'user_username')) {
    createdBy = hookData.user_username
  } else if (checkNested(hookData, 'user', 'username')) {
    createdBy = hookData.user.username
  }

  // get gitlab createdAt if applicable
  const createdAt = checkNested(hookData, 'created_at')
    ? hookData.created_at : null

  // get gitlab push total_commits_count if applicable
  const pushCommitsCount = checkNested(hookData, 'total_commits_count')
    ? hookData.total_commits_count : null

  // get gitlab release tag if applicable
  const releaseTag = checkNested(hookData, 'tag')
    ? hookData.tag : null

  const notification = new Notification({
    username: username,
    gitlabProjectId: hookData.project.id,
    gitlabProjectName: hookData.project.name,
    type: hookData.object_kind,
    gitlabCreatedAt: createdAt,
    gitlabCreatedBy: createdBy,
    gitlabInstanceUrl: removeUrlPath(projectUrl),
    pushCommitsCount: pushCommitsCount,
    releaseTag: releaseTag
  })

  return notification
}

/**
  * Adds Notification to db and emits notification event
  *
  * @param {Notification} note - Notification object for db
  */
const addNotificationToDb = (note) => {
  note.save().then((dbNote, err) => {
    if (err) {
      console.error(err)
    } else {
      emitter.emit('notification', dbNote)
    }
  })
}

/**
  * Sends POST requests to Slack with notification text
  *
  * @param {Notification} notification - A GitLab event notification object
  */
const notifySlack = (note, user) => {
  const project = user.settings.projects.find(p => p.id === note.gitlabProjectId)
  const slackAppUrl = user.settings.slackAppUrl
  const body = { text: doText(note) }
  let send = false

  if ((note.type === 'push' && project.slackNotifications.getPushEvents) ||
      (note.type === 'release' && project.slackNotifications.getReleaseEvents)) {
    send = true
  }

  if (send && slackAppUrl) {
    fetch(slackAppUrl, {
      headers: { 'Content-type': 'application/json' },
      method: 'POST',
      body: JSON.stringify(body)
    })
      .catch(err =>
        console.error(err)
      )
  }
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
