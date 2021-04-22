/**
 * User page component
 * @author Niall Thurrat
 */

import React, { useState, useEffect } from 'react'
import UserService from '../../services/user.service'
import Profile from './profile.component'
import UserSettings from './user-settings.component'

const UserPage = (props) => {
  const [user, setUser] = useState({})

  useEffect(() => {
    UserService.getUser().then(
      (response) => {
        setUser(response.data.user)
      },
      (error) => {
        console.error(error)
        if (error.response.status === 401) {
          props.history.push('/login')
          window.location.reload()
        }
      }
    )
  }, [props.history])

  function handleChange (newUser) {
    setUser(newUser)
  }

  return (
    <div className='container content-pad'>
      <Profile user={user} />
      <UserSettings user={user} onChange={handleChange} />
    </div>
  )
}

export default UserPage
