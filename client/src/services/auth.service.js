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
          username: user.username,
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

const getCurrentUser = () => { // bit muddled here - this is getting user details from local storage. Get from API instead.
  return JSON.parse(
    localStorage.getItem('user'))
}

export default {
  signup,
  login,
  logout,
  getCurrentUser
}
