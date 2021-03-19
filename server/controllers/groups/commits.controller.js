/**
 * User gitlab group commits controller
 *
 * @author Niall Thurrat
 * @version 1.0.0
 */

'use strict'

import fetch from 'node-fetch'
import dotenv from 'dotenv'

dotenv.config()

const URL = 'https://gitlab.lnu.se/api/v4'
const TOKEN = process.env.GL_TOKEN

/**
 * Get all commits for all projects of a group
 * Handling GET requests to endpoint /api/users/:username/groups/:id/commits
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next - Next middleware func
 * @response success gives 200 OK with JSON body
 *
 */
const commitsController = async (req, res, next) => {
  try {
    const groupId = req.params.id
    const projectsUrl = `${URL}/groups/${groupId}/projects`
    const params = {
      headers: { 'PRIVATE-TOKEN': TOKEN }
    }
    const commitsJson = { data: [] }

    const ids = await fetch(projectsUrl, params)
      .then(res => res.json())
      .then(projects => projects.map(p => p.id))

    // HANDLE HOW MANY COMMITS YOU WANT HERE - CURRENTLY GETTING 20 MAX PER PROJECT DUE TO PAGINATION
    const requests = ids.map(id => fetch(
        `${URL}/projects/${id}/repository/commits`, params
    ))

    commitsJson.data = await Promise.all(requests)
      .then(responses => Promise.all(
        responses.map(r => r.json())
      ))
      .then(rJsons => Promise.all(
        rJsons.map((rj, index) => {
          return {
            projectId: ids[index],
            commits: rj
          }
        })
      ))
    res.status(200).json(commitsJson)
  } catch (error) {
    next(error)
  }
}

export default commitsController
