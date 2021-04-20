/**
 * App component of myHub client app
 *
 * @author Niall Thurrat
 * @credits Got help from bezkoder for this one:
 * https://bezkoder.com/react-crud-web-api/
 */

import React, { useState, useEffect } from 'react'
import { Switch, Route, Link } from 'react-router-dom'
import '@fortawesome/fontawesome-free/css/all.min.css'
import 'bootstrap-css-only/css/bootstrap.min.css'
import 'mdbreact/dist/css/mdb.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'

import AuthService from './services/auth.service'

import Login from './components/auth/login.component'
import Signup from './components/auth/signup.component'
import Home from './components/home.component'
import UserPage from './components/user/user-page.component'
import GroupSelector from './components/groups/group-selector.component'
import Group from './components/groups/group.component'
import { MDBNotification } from 'mdbreact'

const App = () => {
  const [currentUser, setCurrentUser] = useState(undefined)

  useEffect(() => {
    const user = AuthService.getCurrentUser()

    if (user) {
      setCurrentUser(user)
    }
  }, [])

  const logOut = () => {
    AuthService.logout()
    setCurrentUser(undefined)
  }

  return (
    <div>
      <nav className='navbar navbar-expand navbar-dark bg-dark'>
        <Link to='/' className='navbar-brand'>
          myHub
        </Link>
        <div className='navbar-nav mr-auto'>
          {currentUser && (
            <li className='nav-item'>
              <Link to='/groups' className='nav-link'>
                Groups
              </Link>
            </li>
          )}
        </div>

        {currentUser ? (
          <div className='navbar-nav ml-auto'>
            <li className='nav-item'>
              <Link to='/user' className='nav-link'>
                {currentUser.username}
              </Link>
            </li>
            <li className='nav-item'>
              <Link to='/' className='nav-link' onClick={logOut}>
              LogOut
              </Link>
            </li>
          </div>
        ) : (
          <div className='navbar-nav ml-auto'>
            <li className='nav-item'>
              <Link to='/login' className='nav-link'>
                Login
              </Link>
            </li>

            <li className='nav-item'>
              <Link to='/signup' className='nav-link'>
                Sign Up
              </Link>
            </li>
          </div>
        )}
      </nav>

      <div
        className='container mt-3 float-left w-75'
        style={{ backgroundColor: 'rgba(255,0,0,0.1)' }}
      >
        <Switch>
          <Route exact path={['/', '/home']} component={Home} />
          <Route exact path='/login' component={Login} />
          <Route exact path='/signup' component={Signup} />
          <Route exact path='/user' component={UserPage} />
          <Route exact path='/groups' component={GroupSelector} />
          <Route path='/groups/:id' component={Group} />
        </Switch>
      </div>
      <div
        className='container mt-3 float-right w-25 p-1'
        style={{ backgroundColor: 'rgba(255,0,0,0.1)' }}
      >
        <MDBNotification
          show
          fade
          iconClassName='text-primary'
          title='Bootstrap'
          message='Hello, world! This is a toast message.'
          text='11 mins ago'
        />
      </div>
    </div>
  )
}

export default App
