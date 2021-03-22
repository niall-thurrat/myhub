/**
 * Authentication services
 *
 * @author Niall Thurrat
 * @credits Got help from bezkoder for this one:
 * https://bezkoder.com/react-hooks-jwt-auth/
 */

import http from '../http-common'

const register = (username, email, password) => {
  return http.post('/auth/signup', {
    username,
    email,
    password
  })
}

const login = (username, password) => {
  return http.post('/auth/login', {
    username,
    password
  })
    .then((response) => {
      if (response.accessToken) {
        localStorage.setItem('user',
          JSON.stringify(response.data))
      }

      return response.data
    })
}

const logout = () => {
  localStorage.removeItem('user')
}

const getCurrentUser = () => {
  return JSON.parse(
    localStorage.getItem('user'))
}

export default {
  register,
  login,
  logout,
  getCurrentUser
}
