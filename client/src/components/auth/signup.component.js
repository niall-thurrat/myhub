/**
 * Signup component
 *
 * @author Niall Thurrat
 * @credits Got help from bezkoder for this one:
 * https://bezkoder.com/react-hooks-jwt-auth/
 */

import React, { useState, useRef } from 'react'
import Form from 'react-validation/build/form'
import Input from 'react-validation/build/input'
import CheckButton from 'react-validation/build/button'
import { isEmail } from 'validator'

import AuthService from '../../services/auth.service'

const required = (value) => {
  if (!value) {
    return (
      <div className='alert alert-danger' role='alert'>
         This field is required!
      </div>
    )
  }
}

const validEmail = (value) => {
  if (!isEmail(value)) {
    return (
      <div className='alert alert-danger' role='alert'>
         This is not a valid email
      </div>
    )
  }
}

const vusername = (value) => {
  if (value.length < 6 || value.length > 20) {
    return (
      <div className='alert alert-danger' role='alert'>
         The username must be between 6 and 20 characters
      </div>
    )
  }
}
// TODO handle non unique username client side

const vpassword = (value) => {
  if (value.length < 8 || value.length > 40) {
    return (
      <div className='alert alert-danger' role='alert'>
         Password must be 8-40 characters and include lowercase, uppercase and a special character
      </div>
    )
  }
}

// TODO either give name option here or remove from server side

const Signup = (props) => {
  const form = useRef()
  const checkBtn = useRef()

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [successful, setSuccessful] = useState(false)
  const [message, setMessage] = useState('')

  const onChangeUsername = (e) => {
    const username = e.target.value
    setUsername(username)
  }

  const onChangeEmail = (e) => {
    const email = e.target.value
    setEmail(email)
  }

  const onChangePassword = (e) => {
    const password = e.target.value
    setPassword(password)
  }

  const handleSignup = (e) => {
    e.preventDefault()

    setMessage('')
    setSuccessful(false)

    form.current.validateAll()

    if (checkBtn.current.context._errors.length === 0) {
      AuthService.signup(username, email, password).then(
        () => {
          setMessage('Success! You can now login to myHub')
          setSuccessful(true)
        },
        (error) => {
          const resMessage =
             (error.response &&
               error.response.data &&
               error.response.data.message) ||
             error.message ||
             error.toString()

          setMessage(resMessage)
          setSuccessful(false)
        }
      )
    }
  }

  return (
    <div className='col-md-12'>
      <div className='card card-container'>
        <img
          src='//ssl.gstatic.com/accounts/ui/avatar_2x.png'
          alt='profile-img'
          className='profile-img-card'
        />

        <Form onSubmit={handleSignup} ref={form}>
          {!successful && (
            <div>
              <div className='form-group'>
                <label htmlFor='username'>Username</label>
                <Input
                  type='text'
                  className='form-control'
                  name='username'
                  value={username}
                  onChange={onChangeUsername}
                  validations={[required, vusername]}
                />
              </div>

              <div className='form-group'>
                <label htmlFor='email'>Email</label>
                <Input
                  type='text'
                  className='form-control'
                  name='email'
                  value={email}
                  onChange={onChangeEmail}
                  validations={[required, validEmail]}
                />
              </div>

              <div className='form-group'>
                <label htmlFor='password'>Password</label>
                <Input
                  type='password'
                  className='form-control'
                  name='password'
                  value={password}
                  onChange={onChangePassword}
                  validations={[required, vpassword]}
                />
              </div>

              <div className='form-group'>
                <button className='btn btn-primary btn-block'>Sign Up</button>
              </div>
            </div>
          )}

          {message && (
            <div className='form-group'>
              <div
                className={successful ? 'alert alert-success' : 'alert alert-danger'}
                role='alert'
              >
                {message}
              </div>
            </div>
          )}
          <CheckButton style={{ display: 'none' }} ref={checkBtn} />
        </Form>
      </div>
    </div>
  )
}

export default Signup
