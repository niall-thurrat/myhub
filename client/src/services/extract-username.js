/**
 * Username extractor (from JWT in local storage)
 * @author Niall Thurrat
 */

import jwt from 'jsonwebtoken'

const SECRET = process.env.REACT_APP_JWT_SECRET

export default function extractUsername () {
  const user = JSON.parse(localStorage.getItem('user'))

  if (user && user.accessToken) {
    jwt.verify(user.accessToken,
      SECRET, decoded => { // TODO pass err and handle
        return decoded.username
      })
  } else {
    return {}
  }
}
