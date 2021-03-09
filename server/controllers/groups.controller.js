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

groupsController.all = (req, res) => {
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

export default groupsController
