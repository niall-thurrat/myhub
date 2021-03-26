/**
 * Profile component
 *
 * @author Niall Thurrat
 * @credits Got help from bezkoder for this one:
 * https://bezkoder.com/react-hooks-jwt-auth/
 */

import React, { useState, useEffect } from 'react'
import UserService from '../../services/user.service'
import AuthService from '../../services/auth.service'

const Profile = () => {
  const [user, setUser] = useState({})
  const [message, setMessage] = useState('')

  useEffect(() => {
    UserService.getUser().then(
      (response) => {
        // use myHub database (if user has set token)
        setUser(response.data.user)
      },
      (error) => {
        // ...otherwise use user from local storage
        setMessage(error.response.statusText)
        setUser(AuthService.getCurrentUser())
      }
    )
  }, [])

  return (
    <div className='container'>
      <header className='jumbotron'>
        <h3>
        Profile: {user.username}
        </h3>
      </header>
      <p>
        <strong>Name:</strong> {user.name}
      </p>
      <p>
        <strong>myHub ID:</strong> {user._id}
      </p>
      <p>
        <strong>Email:</strong> {user.email}
      </p>

      {/* TODO handle password edit */}

      <p>
        <strong>GitLab username:</strong> {user.gitlabUsername || message}
      </p>
    </div>
  )
}

export default Profile
