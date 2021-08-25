import Notification from '../../models/notification.model'
import fetch from 'node-fetch'
import User from '../../models/user.model'

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
    const url = req.user.gitlabInstanceUrl
    const groupId = req.params.id
    const query = '?min_access_level='
    // Maintainer access (min_access_level 40) required for project webhooks
    const accessLevel = '40'
    const projectsUrl = `${url}/api/v4/groups/${groupId}/projects${query}${accessLevel}`
    const params = { headers: { 'PRIVATE-TOKEN': token } }
    const notificationsJson = { notifications: [] }

    // get project ids of a group
    const ids = await fetch(projectsUrl, params)
      .then(res => res.json())
      .then(projects => projects.map(p => p.id))

    // use project ids to get notifications from db
    notificationsJson.notifications = await Notification.find({
      username: username,
      gitlabProjectId: {
        $in: ids
      }
    }, function (err, docs) {
      if (err) console.error(err)
      return docs
    })

    notificationsJson.lastViewed = await
    getGroupLastViewed(username, groupId)

    // TODO - FIX BUG HERE - notificationsJson.lastViewed is always current dateTime - why?

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
