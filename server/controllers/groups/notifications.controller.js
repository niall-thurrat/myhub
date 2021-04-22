/**
 * User gitlab group notifications controller
 * @author Niall Thurrat
 */

import Notification from '../../models/notification.model'
import fetch from 'node-fetch'
import createError from 'http-errors'

const URL = 'https://gitlab.lnu.se/api/v4'

/**
   * Get all notifications for all projects of a group
   * Handling GET requests to endpoint
   * /api/users/:username/groups/:id/notifications
   *
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   * @response success gives 200 OK with JSON body
   *
   */
const notificationsController = async (req, res, next) => {
  try {
    const token = req.user.gitlabToken
    const groupId = req.params.id
    const projectsUrl = `${URL}/groups/${groupId}/projects`
    const params = {
      headers: { 'PRIVATE-TOKEN': token }
    }
    const releasesJson = { data: [] }

    if (!token) {
      return next(createError(401,
        'No GitLab private token set for user'))
    }

    // get project ids of a group
    const ids = await fetch(projectsUrl, params)
      .then(res => res.json())
      .then(projects => projects.map(p => p.id))

    // use project ids to get notifications from db
    releasesJson.data = await Notification.find({
      gitlabProjectId: {
        $in: ids
      }
    }, function (err, docs) {
      if (err) console.error(err)
      return docs
    })

    // TODO THINK ABOUT.... AT WHAT POINT DO YOU SPECIFIY ACCESS LEVEL FOR USER HERE???
    // TODO TEST WITH MULTIPLE NOTIFICATIONS (ONLY ONE IN AT PRESENT

    res.status(200).json(releasesJson)
  } catch (error) {
    next(error)
  }
}

export default notificationsController
