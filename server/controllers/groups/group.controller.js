import fetch from 'node-fetch'
import { simplifyGroup } from '../../utils/utils'
import createError from 'http-errors'
import updateViewsInDb from '../../lib/viewsDbUpdater'

/**
 * Get one group of a user by id
 * Handling GET requests to endpoint /api/users/:username/groups/:id
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next - Next middleware func
 * @response success gives 200 OK with JSON body
 *
 */
const groupController = async (req, res, next) => {
  const token = req.user.gitlabToken
  const url = req.user.gitlabInstanceUrl
  const groupId = req.params.id
  const groupUrl = `${url}/api/v4/groups/${groupId}`

  let resStatus

  updateViewsInDb(req)

  const groupJson = await fetch(groupUrl, {
    headers: { 'PRIVATE-TOKEN': token }
  })
    .then(res => {
      resStatus = res.status
      return res.json()
    })
    .catch(error =>
      next(createError(error))
    )

  if (resStatus === 200) {
    const simpleGroup = simplifyGroup(groupJson)

    res.status(200).json(simpleGroup)
  } else {
    return next(createError(
      resStatus, groupJson.message
    ))
  }
}

export default groupController
