import http from '../http-common'

class GroupsListDataService {
  getAll () {
    return http.get('/groups/list')
  }

  get (id) {
    return http.get(`/groups/${id}`)
  }

  findByName (name) {
    return http.get(`/groups?name=${name}`)
  }
}

export default new GroupsListDataService()
