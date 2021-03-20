/**
 * User gitlab group controller
 *
 * @author Niall Thurrat
 * @version 1.0.0
 */

'use strict'

import fetch from 'node-fetch'
import { simplifyGroup } from '../../utils/utils'
import createError from 'http-errors'

const URL = 'https://gitlab.lnu.se/api/v4'

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
const groupController = (req, res, next) => {
  const groupId = req.params.id
  const groupUrl = `${URL}/groups/${groupId}`
  const token = req.user.gitlabToken

  if (!token) {
    return next(createError(401,
      'No GitLab private token set for user'))
  }

  fetch(groupUrl, {
    headers: { 'PRIVATE-TOKEN': token }
  })
    .then(res => res.json())
    .then(groupJson => {
      const simpleGroup = simplifyGroup(groupJson)

      res.status(200).json(simpleGroup)
    })
    .catch(error =>
      next(createError(error))
    )
}

export default groupController
