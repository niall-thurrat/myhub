import User from '../../models/user.model'
import updateViewsInDb from '../../lib/viewsDbUpdater'
import fetch from 'node-fetch'
import createError from 'http-errors'

const settingsController = {}

/**
  * Get user's settings for a specific group
  * GET /api/users/:username/groups/:id/settings
  *
  * @param {Object} req
  * @param {Object} res
  * @param {Function} next
  * @response success gives 200 OK with JSON body
  */
settingsController.get = async (req, res, next) => {
  try {
    const token = req.user.gitlabToken
    const username = req.user.username
    const url = req.user.gitlabInstanceUrl
    const groupId = req.params.id
    const query = '?min_access_level='
    // Maintainer access (min_access_level 40) required for project webhooks
    const accessLevel = '40'
    const projectsUrl = `${url}/api/v4/groups/${groupId}/projects${query}${accessLevel}`
    const params = { headers: { 'PRIVATE-TOKEN': token } }

    // get project ids+names of a group from GitLab
    const groupProjects = await fetch(projectsUrl, params)
      .then(res => res.json())
      .then(projects => projects.map(project => {
        const projectObj = {
          id: project.id,
          name: project.name
        }
        return projectObj
      }))

    // get project ids from settings in db
    const dbIds = await User.findOne({ username })
      .then(user => user.settings.projects.map(p => p.id))

    // remove settings for projects in db not found in gitlab
    if (dbIds.length > 0) {
      for (const dbId of dbIds) {
        if (!groupProjects.some(project => project.id === dbId)) {
          await User.findOneAndUpdate({
            username: username,
            'settings.projects.id': dbId
          },
          { $pull: { 'settings.projects': { id: dbId } } })
        }
      }
    }

    // add default settings for gitlab projects not found in db
    if (groupProjects.length > 0) {
      for (const project of groupProjects) {
        await User.findOneAndUpdate({
          username: username,
          'settings.projects.id': { $ne: project.id }
        },
        {
          $addToSet: {
            'settings.projects': {
              id: project.id,
              name: project.name
            }
          }
        })
      }
    }

    const user = await User.findOne({ username })

    updateViewsInDb(req)
    res.status(200).json(user.settings)
  } catch (error) {
    next(error)
  }
}

/**
  * Edit user's settings for a specific group
  * PATCH /api/users/:username/groups/:id/settings
  *
  * @param {Object} req - request object
  * @param {Object} res - response object
  * @param {Function} next - next middleware func
  */
settingsController.edit = async (req, res, next) => {
  const updateType = req.body.updateType

  switch (updateType) {
    case 'slackAppUrl':
      updateSlackAppUrl(req, res, next)
      break

    case 'webhookSecret':
      updateWebhookSecret(req, res, next)
      break

    case 'getPushEvents':
      updateGetPushEvents(req, res, next)
      break

    case 'getReleaseEvents':
      updateGetReleaseEvents(req, res, next)
      break

    default:
      return next(createError(400,
        'Settings update request error'
      ))
  }
}

const updateSlackAppUrl = (req, res, next) => {
  const username = req.user.username
  const newData = { 'settings.slackAppUrl': req.body.slackAppUrl }

  User.findOneAndUpdate({ username: username },
    { $set: newData }, (err) => {
      if (err) {
        return next(createError(400,
          'error updating slackAppUrl in user settings', err
        ))
      }
      res.status(204).send()
    })
}

const updateWebhookSecret = async (req, res, next) => {
  const username = req.user.username
  const id = req.body.projectId
  const newData = {
    'settings.projects.$.webhookSecret': req.body.webhookSecret
  }

  await User.findOneAndUpdate({
    username: username,
    'settings.projects.id': id
  },
  { $set: newData }, (err, doc) => {
    if (err) {
      return next(createError(400,
        'error updating webhookSecret in user settings', err
      ))
    }
    res.status(204).send()
  })
}

const updateGetPushEvents = async (req, res, next) => {
  const username = req.user.username
  const id = req.body.projectId
  const newData = {
    'settings.projects.$.slackNotifications.getPushEvents': req.body.getPushEvents
  }

  await User.findOneAndUpdate({
    username: username,
    'settings.projects.id': id
  },
  { $set: newData }, (err, doc) => {
    if (err) {
      return next(createError(400,
        'error updating getPushEvents in user settings', err
      ))
    }
    res.status(204).send()
  })
}

const updateGetReleaseEvents = async (req, res, next) => {
  const username = req.user.username
  const id = req.body.projectId
  const newData = {
    'settings.projects.$.slackNotifications.getReleaseEvents': req.body.getReleaseEvents
  }

  await User.findOneAndUpdate({
    username: username,
    'settings.projects.id': id
  },
  { $set: newData }, (err, doc) => {
    if (err) {
      return next(createError(400,
        'error updating getReleaseEvents in user settings', err
      ))
    }
    res.status(204).send()
  })
}

export default settingsController
