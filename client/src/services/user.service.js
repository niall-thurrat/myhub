/**
 * User data services
 *
 * @author Niall Thurrat
 * @credits Got help from bezkoder for this one:
 * https://bezkoder.com/react-hooks-jwt-auth/
 */

import http from '../http-common'
import authHeader from './auth-header'
import username from './username'

const userPath = `/users/${username()}`
const options = {
  headers: authHeader()
}

const getUser = () => {
  return http.get(userPath, options)
}

const updateUser = (data) => {
  return http.patch(userPath, data, options)
}

// eslint-disable-next-line
export default {
  getUser,
  updateUser
}
