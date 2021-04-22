/**
 * Profile component
 *
 * @author Niall Thurrat
 * @credits Got help from bezkoder for this one:
 * https://bezkoder.com/react-hooks-jwt-auth/
 */

import React from 'react'

const Profile = (props) => {
  return (
    <div className='container'>
      <header className='jumbotron'>
        <h3>
        Profile: {props.user.username}
        </h3>
      </header>
      <p>
        <strong>Name:</strong> {props.user.name}
      </p>
      <p>
        <strong>myHub ID:</strong> {props.user._id}
      </p>
      <p>
        <strong>Email:</strong> {props.user.email}
      </p>

      {/* TODO handle password edit */}

      <p>
        <strong>GitLab username:</strong> {props.user.gitlabUsername}
      </p>
    </div>
  )
}

export default Profile
