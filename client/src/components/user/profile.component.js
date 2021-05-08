/**
 * Profile component
 *
 * @author Niall Thurrat
 * @credits Got help from bezkoder for this one:
 * https://bezkoder.com/react-hooks-jwt-auth/
 */

import React from 'react'
import UserService from '../../services/user.service'

const Profile = props => {
  const handleInputChange = event => {
    const { name, value } = event.target
    props.onChange({ ...props.user, [name]: value })
  }

  const updateProfile = () => {
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
        Profile: {props.user.username}
        </h3>
      </header>

      <div className='edit-form'>
        <form>
          <div className='form-group'>
            <label htmlFor='name'>Name</label>
            <input
              type='text'
              className='form-control'
              id='name'
              name='name'
              value={props.user.name}
              onChange={handleInputChange}
            />
          </div>
          <div className='form-group'>
            <label htmlFor='email'>Email</label>
            <input
              type='text'
              className='form-control'
              id='email'
              name='email'
              value={props.user.email}
              onChange={handleInputChange}
            />
          </div>
        </form>

        <button
          type='submit'
          className='badge badge-success'
          onClick={updateProfile}
        >
            Update
        </button>
      </div>

      <p />
      <p>
        <strong>myHub ID:</strong> {props.user._id}
      </p>

      <p>
        <strong>GitLab ID:</strong> {props.user.gitlabId}
      </p>

      <p>
        <strong>GitLab username:</strong> {props.user.gitlabUsername}
      </p>

      {/* TODO gitlabApiConnection must be handled on backend -
      it is important to demonstrate to user that their settings are correct
      <p>
        <strong>Connected to GitLab API:</strong>
        {props.user.gitlabApiConnection.toString()}
      </p> */}

      {/* TODO handle password edit */}<p />
    </div>
  )
}

export default Profile
