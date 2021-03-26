/**
 * User settings component
 * @author Niall Thurrat
 */

import React, { useState, useEffect } from 'react'
import UserService from '../../services/user.service'

const UserSettings = () => {
  const [user, setUser] = useState({})

  useEffect(() => {
    UserService.getUser().then(
      (response) => {
        setUser(response.data.user)
        console.log('helloe')
      },
      (error) => {
        console.error(error.response)
      }
    )
  }, [])

  return (
    <div className='container'>
      <header className='jumbotron'>
        <h3>
        User Settings
        </h3>
      </header>
      <p>
      Please add your GitLab Personal Access Token, ID and instance URL to
      gain access to your GitLab user and group data on myHub. To activate
      a token select Edit Profile then Access Tokens
      in GitLab. Here you can choose the scope of access that myHub will
      get with this token, and you can revoke the token or change the scopes
      at any time. You can also delete the reference to the token here in myHub.
      </p>
      <p>
        <strong>GitLab Personal Access Token:</strong> {user.gitlabToken || 'not set'}
      </p>
      <p>
        <strong>GitLab instance URL:</strong> {user.gitlabInstanceUrl}
      </p>
      <p>
        <strong>GitLab ID:</strong> {user.gitlabId}
      </p>
    </div>
  )
}

export default UserSettings
