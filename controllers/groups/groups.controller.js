import fetch from 'node-fetch'
import { simplifyGroup } from '../../utils/utils'
import createError from 'http-errors'
import updateViewsInDb from '../../lib/viewsDbUpdater'

/**
 * Get a user's GitLab groups (simplified)
 * GET /api/users/:username/groups
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
const groupsController = (req, res, next) => {
  const token = req.user.gitlabToken
  const url = req.user.gitlabInstanceUrl
  const nameValue = req.query.name
  const nameQuery = nameValue ? nameValue.toLowerCase() : null
  // min_access_level 30 is at least 'Developer' access
  const accessLevel = '30'
  const accessQuery = '?min_access_level='
  const myGroupsUrl = `${url}/api/v4/groups${accessQuery}${accessLevel}`

  updateViewsInDb(req)

  fetch(myGroupsUrl, {
    headers: { 'PRIVATE-TOKEN': token }
  })
    .then(res => res.json())
    .then(allGroups => {
      const resJson = { data: [] }

      if (nameQuery) {
        allGroups.forEach(group => {
          const name = group.full_name.toLowerCase()

          if (name.includes(nameQuery)) {
            const simpleGroup = simplifyGroup(group)
            resJson.data.push(simpleGroup)
          }
        })
      } else {
        allGroups.forEach(group => {
          const simpleGroup = simplifyGroup(group)
          resJson.data.push(simpleGroup)
        })
      }
      res.status(200).json(resJson)
    })
    .catch(error =>
      next(createError(error))
    )
}

export default groupsController
