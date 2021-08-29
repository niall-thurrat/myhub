import React, { useState, useEffect } from 'react'
import UserService from '../../services/user.service'

const Profile = () => {
  const [user, setUser] = useState({})

  useEffect(() => {
    UserService.getUser().then(
      (response) => {
        setUser(response.data.user)
      },
      (error) => console.error(error)
    )
  }, [])

  function handleNameChange (e) {
    setUser({ ...user, name: e.target.value })
  }

  function handleEmailChange (e) {
    setUser({ ...user, email: e.target.value })
  }

  const updateProfile = () => {
    UserService.updateUser(user)
      .catch(error => { console.error(error) })
  }

  return (
    <div className='container'>
      <header className='mt-4 mb-4'>
        <h3>
        Profile: {user.username}
        </h3>
      </header>

      <div className='edit-form'>
        <form>
          <div className='form-group input-group'>
            <div className='input-group-prepend'>
              <span className='input-group-text bg-gray font-weight-bold text-body' id='name-prepend'>
                Name
              </span>
            </div>
            <input
              type='text'
              className='form-control'
              id='name'
              name='name'
              value={user.name}
              onChange={handleNameChange}
            />
          </div>
          <div className='form-group input-group'>
            <div className='input-group-prepend'>
              <span className='input-group-text bg-gray font-weight-bold text-body' id='email-prepend'>
                Email
              </span>
            </div>
            <input
              type='text'
              className='form-control'
              id='email'
              name='email'
              value={user.email}
              onChange={handleEmailChange}
            />
          </div>
        </form>

        <button
          type='submit'
          className='btn btn-primary m-0'
          onClick={updateProfile}
        >
            Update
        </button>
      </div>

      <br />
      <p>
        <strong>myHub ID:</strong> {user._id}
      </p>

      <p>
        <strong>GitLab ID:</strong> {user.gitlabId}
      </p>

      <p>
        <strong>GitLab username:</strong> {user.gitlabUsername}
      </p>
      <br />

    </div>
  )
}

export default Profile
