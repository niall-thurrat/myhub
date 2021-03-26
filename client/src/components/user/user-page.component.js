/**
 * User page component
 * @author Niall Thurrat
 */

import React from 'react'

import Profile from './profile.component'
import UserSettings from './user-settings.component'

const UserPage = () => {
  return (
    <div className='container'>
      <Profile />
      <UserSettings />
    </div>
  )
}

export default UserPage
