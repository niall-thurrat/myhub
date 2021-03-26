/**
 * BoardUser component
 *
 * @author Niall Thurrat
 * @credits Got help from bezkoder for this one:
 * https://bezkoder.com/react-hooks-jwt-auth/
 */

import React, { useState, useEffect } from 'react'
import UserService from '../services/user.service'

const BoardUser = () => {
  const [content, setContent] = useState('')

  useEffect(() => {
    UserService.getUser().then(
      (response) => {
        setContent(response.data) // CONVERT THIS MODULE TO THE GROUP-SELECTER WHICH WILL CONTAIN GROUP-SEARCH, GROUP-LIST AND SELECTED-GROUP COMPS
      },
      (error) => {
        const _content =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString()

        setContent(_content)
      }
    )
  }, [])

  return (
    <div className='container'>
      <header className='jumbotron'>
        <h3>{content}</h3>
        <p>Username: {content.username}</p>
        <p>email: {content.email}</p>
        <p>gitlabToken: {content.gitlabToken}</p>
      </header>
    </div>
  )
}

export default BoardUser
