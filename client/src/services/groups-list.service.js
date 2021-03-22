/**
 * Groups-list services
 *
 * @author Niall Thurrat
 * @credits Got help from bezkoder for this one:
 * https://bezkoder.com/react-crud-web-api/
 */

import http from '../http-common'

class GroupsListDataService {
  getAll () {
    return http.get('/groups/list')
  }

  get (id) {
    return http.get(`/groups/${id}`)
  }

  findByName (name) {
    return http.get(`/groups/list?name=${name}`)
  }

  getCommits (id) {
    return http.get(`/groups/${id}/commits`)
  }
}

export default new GroupsListDataService()
