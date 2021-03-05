import http from '../http-common'

class GroupsListDataService {
  getAll () {
    return http.get('/groups/list')
  }
}

export default new GroupsListDataService()
