/**
 * Groups controller
 *
 * @author Niall Thurrat
 * @version 1.0.0
 */

'use strict'

import fetch from 'node-fetch'
import dotenv from 'dotenv'

dotenv.config()
const uri = 'https://gitlab.lnu.se/api/v4/groups'

const groupsController = {}

groupsController.getAll = (req, res) => {
  const query = req.query.name
  const nameQuery = query ? query.toLowerCase() : null

  fetch(uri, {
    method: 'GET',
    'PRIVATE-TOKEN': process.env.GL_TOKEN
  })
    .then(res => res.json())
    .then(allGroups => {
      const queryGroups = { data: [] }

      if (nameQuery) {
        allGroups.forEach((group) => {
          const name = group.full_name.toLowerCase()

          if (name.includes(nameQuery)) {
            const newJson = trimGroupJson(group)
            queryGroups.data.push(newJson)
          }
        })
      }
      const resJson = queryGroups.data[0] ? queryGroups : allGroups
      console.log(resJson)

      res.status(200).json(resJson)
    })
}

groupsController.list = (req, res) => {
  fetch(uri, {
    method: 'GET',
    'PRIVATE-TOKEN': process.env.GL_TOKEN
  })
    .then(res => res.json())
    .then(json => {
      const resJson = { data: [] }

      json.forEach(group => {
        const newJson = trimGroupJson(group)
        resJson.data.push(newJson)
      })
      res.status(200).json(resJson)
    })
}

groupsController.get = (req, res) => {
  const groupId = req.params.id
  const groupUri = uri + '/' + groupId

  fetch(groupUri, {
    method: 'GET',
    'PRIVATE-TOKEN': process.env.GL_TOKEN
  })
    .then(res => res.json())
    .then(json => {
      const group = {
        id: json.id,
        full_name: json.full_name
      }

      res.status(200).json(group)
    })
}

// can this be done mush neater with .map or something?
function trimGroupJson (json) {
  const newJson = {}

  newJson.id = json.id
  newJson.full_name = json.full_name
  newJson.description = json.description

  return newJson
}

export default groupsController
