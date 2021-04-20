/**
 * Authentication services
 *
 * @author Niall Thurrat
 * @credits Got help from bezkoder for this one:
 * https://bezkoder.com/react-hooks-jwt-auth/
 */

import http from '../http-common'

const signup = (username, email, password) => {
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
      const user = response.data.user
      const token = response.data.token

      if (user) {
        const storageUser = {
          _id: user._id,
          username: user.username,
          email: user.email,
          name: user.name,
          accessToken: token
        }

        localStorage.setItem('user',
          JSON.stringify(storageUser))
      }

      return user
    })
}

const logout = () => {
  localStorage.removeItem('user')
}

const getCurrentUser = () => {
  return JSON.parse(
    localStorage.getItem('user'))
}

// eslint-disable-next-line
export default {
  signup,
  login,
  logout,
  getCurrentUser
}
