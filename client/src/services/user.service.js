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

const url = `/users/${username()}`
const options = {
  headers: authHeader()
}

const getUser = () => {
  return http.get(url, options)
}

const updateUser = (data) => {
  return http.patch(url, data, options)
}

// eslint-disable-next-line
export default {
  getUser,
  updateUser
}
