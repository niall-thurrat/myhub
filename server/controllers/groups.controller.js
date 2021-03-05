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
      const list = []
      json.forEach(value => list.push(value.full_name))

      res.status(200).json(list)
    })
}

export default groupsController
