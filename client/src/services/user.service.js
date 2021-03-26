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

const getUser = () => {
  return http.get(`/users/${username()}`,
    { headers: authHeader() })
}

// eslint-disable-next-line
export default {
  getUser
}
