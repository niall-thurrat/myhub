/**
 * User settings component
 * @author Niall Thurrat
 */

import React from 'react'
import UserService from '../../services/user.service'

const UserSettings = props => {
  const handleInputChange = event => {
    const { name, value } = event.target
    props.onChange({ ...props.user, [name]: value })
  }

  const updateSettings = () => {
    UserService.updateUser(props.user)
      .then(response => {
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
      Please add your GitLab Personal Access Token and instance URL
      (e.g. https://gitlab.lnu.se) to gain access to your GitLab user and group
      data on myHub. To activate a token select Edit Profile then Access Tokens
      in GitLab, and select either 'api' or 'read_api' scope. These scope ensure that myHub
      can access your group and project data with this token. You can revoke the token or change
      the scope(s) at any time. You can also delete the reference to the token here in myHub.
      </p>

      {/* TODO handle gitlabApiConnection property backend before applying this detail
      <p>
      NOTE! Succesful connection to your gitlab account API is indicated
      above in 'Connected to GitLab API'
      </p> */}

      <div className='edit-form'>
        <form>
          <div className='form-group'>
            <label htmlFor='gitlabToken'>GitLab Personal Access Token</label>
            <input
              type='text'
              className='form-control'
              id='gitlabToken'
              name='gitlabToken'
              value={props.user.gitlabToken}
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
              value={props.user.gitlabInstanceUrl}
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
      </div>
    </div>
  )
}

export default UserSettings
