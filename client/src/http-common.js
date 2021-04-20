/**
 * Http connection to myHub API
 *
 * @author Niall Thurrat
 * @credits Got help from bezkoder for this one:
 * https://bezkoder.com/react-crud-web-api/
 */

import axios from 'axios'

const httpCommon = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-type': 'application/json'
  }
})

// redirect unautorised users to login
httpCommon.interceptors.response.use(
  response => {
    return response
  },
  error => {
    if (error.response.status === 401) {
      window.location = '/login'
    }
    return Promise.reject(error)
  })

export default httpCommon
