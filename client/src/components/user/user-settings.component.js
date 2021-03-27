/**
 * User settings component
 * @author Niall Thurrat
 */

import React, { useState, useEffect } from 'react'
import UserService from '../../services/user.service'

const UserSettings = () => {
  const [user, setUser] = useState({})
  const [message, setMessage] = useState('')

  useEffect(() => {
    UserService.getUser().then(
      (response) => {
        setUser(response.data.user)
      },
      (error) => {
        console.error(error.response)
      }
    )
  }, [])

  const handleInputChange = event => {
    const { name, value } = event.target
    setUser({ ...user, [name]: value })
  }

  const updateSettings = () => {
    UserService.updateUser(user)
      .then(response => {
        // TODO determin if person is now able to access API data
        // ...and communicate this in message
        setMessage('The settings were updated successfully!')
      })
      .catch(e => {
        console.log(e)
      })
  }

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
      <div className='edit-form'>
        <form>
          <div className='form-group'>
            <label htmlFor='gitlabToken'>GitLab Personal Access Token</label>
            <input
              type='text'
              className='form-control'
              id='gitlabToken'
              name='gitlabToken'
              value={user.gitlabToken}
              onChange={handleInputChange}
            />
          </div>
          <div className='form-group'>
            <label htmlFor='gitlabInstanceUrl'>GitLab instance URL</label>
            <input
              type='text'
              className='form-control'
              id='gitlabInstanceUrl'
              name='gitlabInstanceUrl'
              value={user.gitlabInstanceUrl}
              onChange={handleInputChange}
            />
          </div>
          <div className='form-group'>
            <label htmlFor='gitlabId'>GitLab ID</label>
            <input
              type='text'
              className='form-control'
              id='gitlabId'
              name='gitlabId'
              value={user.gitlabId}
              onChange={handleInputChange}
            />
          </div>
        </form>

        <button
          type='submit'
          className='badge badge-success'
          onClick={updateSettings}
        >
            Update
        </button>

        <p>{message}</p>
      </div>
    </div>
  )
}

export default UserSettings