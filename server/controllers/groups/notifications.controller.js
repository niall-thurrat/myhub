/**
 * User gitlab group notifications controller
 * @author Niall Thurrat
 */

import Notification from '../../models/notification.model'
import fetch from 'node-fetch'
import createError from 'http-errors'
import User from '../../models/user.model'

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
    const username = req.user.username
    const groupId = req.params.id
    // min_access_level 40 is at least 'Maintainer' access
    // Maintainer access required for webhook notifications
    const accessValue = '40'
    const accessQuery = '?min_access_level='
    const projectsUrl =
      `${URL}/groups/${groupId}/projects${accessQuery}${accessValue}`
    const params = { headers: { 'PRIVATE-TOKEN': token } }
    const notificationsJson = { data: [] }

    if (!token) {
      return next(createError(401,
        'No GitLab private token set for user'))
    }

    // get project ids of a group
    const ids = await fetch(projectsUrl, params)
      .then(res => res.json())
      .then(projects => projects.map(p => p.id))

    // use project ids to get notifications from db
    notificationsJson.data = await Notification.find({
      gitlabProjectId: {
        $in: ids
      }
    }, function (err, docs) {
      if (err) console.error(err)
      return docs
    })

    notificationsJson.lastViewed = await
    getGroupLastViewed(username, groupId)

    res.status(200).json(notificationsJson)
  } catch (error) {
    next(error)
  }
}

/**
 * get when user last viewed a group
 *
 * @param {String} username - myHub username
 * @param {Number} groupId - GitHub Group ID
 * @returns {Date} when group was last viewed
 */
async function getGroupLastViewed (username, groupId) {
  const doc = await User.findOne({
    username: username,
    'lastGroupViews.groupId': groupId
  }, {
    'lastGroupViews.$': 1
  })

  return doc.lastGroupViews[0].lastViewed
}

export default notificationsController
