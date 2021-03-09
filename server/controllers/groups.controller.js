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
  fetch(uri, {
    method: 'GET',
    'PRIVATE-TOKEN': process.env.GL_TOKEN
  })
    .then(res => res.json())
    .then(json => {
      res.status(200).json(json)
    })
}

groupsController.list = (req, res) => {
  fetch(uri, {
    method: 'GET',
    'PRIVATE-TOKEN': process.env.GL_TOKEN
  })
    .then(res => res.json())
    .then(json => {
      // handle large lists of groups here?
      const resJson = {}
      resJson.data = []

      json.forEach(value => {
        const listItem = {}
        listItem.id = value.id
        listItem.full_name = value.full_name

        resJson.data.push(listItem)
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

export default groupsController
