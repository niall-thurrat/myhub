import axios from 'axios'

const httpCommon = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-type': 'application/json'
  }
})

export default httpCommon
