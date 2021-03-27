/**
 * Groups-list services
 *
 * @author Niall Thurrat
 * @credits Got help from bezkoder for this one:
 * https://bezkoder.com/react-crud-web-api/
 */

import http from '../http-common'
import username from './username'

const userUrl = `/users/${username()}`

class GroupsListDataService {
  getAll () {
    return http.get(`${userUrl}/groups`)
  }

  get (id) {
    return http.get(`${userUrl}/groups/${id}`)
  }

  findByName (name) {
    return http.get(`${userUrl}/groups?name=${name}`)
  }

  getCommits (id) {
    return http.get(`${userUrl}/groups/${id}/commits`)
  }
}

export default new GroupsListDataService()
