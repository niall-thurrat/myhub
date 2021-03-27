/**
 * Groups data services
 *
 * @author Niall Thurrat
 * @credits Got help from bezkoder for this one:
 * https://bezkoder.com/react-crud-web-api/
 */

import http from '../http-common'
import authHeader from './auth-header'
import username from './username'

const userPath = `/users/${username()}`
const options = {
  headers: authHeader()
}

class GroupsService {
  getAll () {
    return http.get(`${userPath}/groups`, options)
  }

  get (id) {
    return http.get(`${userPath}/groups/${id}`, options)
  }

  findByName (name) {
    return http.get(`${userPath}/groups?name=${name}`, options)
  }

  getCommits (id) {
    return http.get(`${userPath}/groups/${id}/commits`, options)
  }
}

export default new GroupsService()
