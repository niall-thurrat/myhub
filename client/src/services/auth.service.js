import http from '../http-common'

class AuthService {
  login () {
    return http.get('/auth/login/success', {
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Credentials': true
      }
    })
  }
}

export default new AuthService()
