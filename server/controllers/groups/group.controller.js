/**
 * User gitlab group controller
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

  fetch(groupUrl, {
    headers: { 'PRIVATE-TOKEN': TOKEN }
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
