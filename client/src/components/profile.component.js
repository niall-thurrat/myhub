/**
 * Profile component
 *
 * @author Niall Thurrat
 * @credits Got help from bezkoder for this one:
 * https://bezkoder.com/react-hooks-jwt-auth/
 */

import React from 'react'
import AuthService from '../services/auth.service' /// //////////// CHANGE THIS MODULE TO user dash (holds profile + settings)

const Profile = () => {
  const currentUser = AuthService.getCurrentUser()

  return (
    <div className='container'>
      <header className='jumbotron'>
        <h3>
          <strong>{currentUser.username}</strong> Profile
        </h3>
      </header>
      <p>
        <strong>Id:</strong> {currentUser.id} {/* wont get */}
      </p>
      <p>
        <strong>Email:</strong> {currentUser.email} {/* wont get */}
      </p>
      <strong>Authorities:</strong> {/* wont get */}
      <ul>
        {currentUser.roles &&
          currentUser.roles.map((role, index) => <li key={index}>{role}</li>)}
      </ul>
    </div>
  )
}

export default Profile
