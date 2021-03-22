/**
 * User services
 *
 * @author Niall Thurrat
 * @credits Got help from bezkoder for this one:
 * https://bezkoder.com/react-hooks-jwt-auth/
 */

import http from '../http-common'
import authHeader from './auth-header'
import username from './username'

const getUserBoard = () => {
  return http.get(`/users/${username()}`,
    { headers: authHeader() })
}

export default {
  getUserBoard
}
