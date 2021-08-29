import http from '../http-common'
import authHeader from './auth-header'
import username from './username'

const userPath = `/users/${username()}`
const options = { headers: authHeader() }

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

  getReleases (id) {
    return http.get(`${userPath}/groups/${id}/releases`, options)
  }

  getNotifications (id) {
    return http.get(`${userPath}/groups/${id}/notifications`, options)
  }

  removeNotifications (id, data) {
    return http.patch(`${userPath}/groups/${id}/notifications`, data, options)
  }

  removeNotification (groupId, noteId, data) {
    return http.patch(`${userPath}/groups/${groupId}/notifications/${noteId}`, data, options)
  }

  getSettings (id) {
    return http.get(`${userPath}/groups/${id}/settings`, options)
  }

  updateSettings (id, data) {
    return http.patch(`${userPath}/groups/${id}/settings`, data, options)
  }

  getSlackConnectionStatus (id) {
    return http.get(`${userPath}/groups/${id}/settings/slack-test`, options)
  }
}

export default new GroupsService()
