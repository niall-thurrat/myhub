import React, { useState, useEffect } from 'react'
import UserService from '../../services/user.service'

const UserSettings = () => {
  const [user, setUser] = useState({})

  useEffect(() => {
    UserService.getUser().then(
      (response) => {
        setUser(response.data.user)
      },
      (error) => console.error(error)
    )
  }, [])

  function handleGitlabTokenChange (e) {
    setUser({ ...user, gitlabToken: e.target.value })
  }

  function handleGitlabInstanceUrlChange (e) {
    setUser({ ...user, gitlabInstanceUrl: e.target.value })
  }

  const updateSettings = () => {
    UserService.updateUser(user)
      .catch(error => { console.error(error) })
  }

  return (
    <div className='container'>
      <header className='mt-4 mb-4'>
        <h3>
          Settings
        </h3>
      </header>
      <p>
      Please add your GitLab Personal Access Token and instance URL
      (e.g. https://gitlab.lnu.se) to gain access to your GitLab user and group
      data on myHub. To activate a token select Edit Profile then Access Tokens
      in GitLab, and select either 'api' or 'read_api' scope. These scope ensure that myHub
      can access your group and project data with this token. You can revoke the token or change
      the scope(s) at any time. You can also delete the reference to the token here in myHub.
      </p>

      <div className='edit-form'>
        <form>
          <div className='form-group input-group'>
            <div className='input-group-prepend'>
              <span className='input-group-text bg-gray font-weight-bold text-body' id='token-prepend'>
                GitLab Personal Access Token
              </span>
            </div>
            <input
              type='text'
              className='form-control'
              id='gitlab-token'
              name='gitlab-token'
              value={user.gitlabToken}
              onChange={handleGitlabTokenChange}
            />
          </div>
          <div className='form-group input-group'>
            <div className='input-group-prepend'>
              <span className='input-group-text bg-gray font-weight-bold text-body' id='url-prepend'>
                GitLab instance URL
              </span>
            </div>
            <input
              type='text'
              className='form-control'
              id='gitlabInstanceUrl'
              name='gitlabInstanceUrl'
              value={user.gitlabInstanceUrl}
              onChange={handleGitlabInstanceUrlChange}
            />
          </div>
        </form>

        <button
          type='submit'
          className='btn btn-primary m-0'
          onClick={updateSettings}
        >
            Update
        </button>
      </div>
    </div>
  )
}

export default UserSettings
