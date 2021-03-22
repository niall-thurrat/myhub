import http from '../http-common'
import authHeader from './auth-header'
import username from './extract-username'

const getPublicContent = () => { // what is this - needed??
  return http.get('all')
}

const getUserBoard = () => {
  return http.get(`/api/user/${username()}`,
    { headers: authHeader() })
}

export default {
  getPublicContent,
  getUserBoard
}
