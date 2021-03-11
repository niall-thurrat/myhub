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

const URL = 'https://gitlab.lnu.se/api/v4/groups'
const TOKEN = process.env.GL_TOKEN

const groupsController = {}

// groupsController.getAll = (req, res) => {
//   fetch(groupsUrl, {
//     headers: { 'PRIVATE-TOKEN': process.env.GL_TOKEN }
//   })
//     .then(res => res.json())
//     .then(allGroups => {
//       const queryGroups = { data: [] }

//       if (nameQuery) {
//         allGroups.forEach((group) => {
//           const name = group.full_name.toLowerCase()

//           if (name.includes(nameQuery)) {
//             const newJson = trimGroupJson(group)
//             queryGroups.data.push(newJson)
//           }
//         })
//       }
//       const resJson = queryGroups.data[0] ? queryGroups : allGroups
//       console.log(resJson)

//       res.status(200).json(resJson)
//     })
// }

groupsController.list = (req, res) => {
  const nameValue = req.query.name
  const nameQuery = nameValue ? nameValue.toLowerCase() : null

  const accessValue = '30' // CHANGE THIS HARD CODE
  const accessQuery = '?min_access_level='
  const myGroupsUrl = `${URL}${accessQuery}${accessValue}`

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
            const newJson = trimGroupJson(group)
            resJson.data.push(newJson)
          }
        })
      } else {
        allGroups.forEach(group => {
          const newJson = trimGroupJson(group)
          resJson.data.push(newJson)
        })
      }

      res.status(200).json(resJson)
    })
}

groupsController.get = (req, res) => {
  const groupId = req.params.id
  const groupUrl = `${URL}/${groupId}`

  fetch(groupUrl, {
    headers: { 'PRIVATE-TOKEN': TOKEN }
  })
    .then(res => res.json())
    .then(json => {
      const group = trimGroupJson(json)

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
