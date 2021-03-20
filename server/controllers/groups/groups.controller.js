/**
 * User gitlab groups controller
 *
 * @author Niall Thurrat
 * @version 1.0.0
 */

'use strict'

import fetch from 'node-fetch'
import { simplifyGroup } from '../../utils/utils'
import dotenv from 'dotenv'
import createError from 'http-errors'

dotenv.config()

const URL = 'https://gitlab.lnu.se/api/v4'
const TOKEN = process.env.GL_TOKEN

/**
 * Get a user's GitLab groups (simplified)
 * Handling GET requests to endpoint /api/users/:username/groups
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next - Next middleware func
 * @response success gives 200 OK with JSON body
 *
 */
const groupsController = (req, res, next) => {
  const nameValue = req.query.name
  const nameQuery = nameValue
    ? nameValue.toLowerCase() : null

  const accessValue = '30' // CHANGE THIS HARD CODE
  const accessQuery = '?min_access_level='
  const myGroupsUrl = `${URL}/groups${accessQuery}${accessValue}`

  fetch(myGroupsUrl, {
    headers: { 'PRIVATE-TOKEN': TOKEN }
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