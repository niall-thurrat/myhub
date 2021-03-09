import React, { Component } from 'react'
import { Switch, Route, Link } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'

import GroupsList from './components/groups-list.component'
import Group from './components/group.component'

class App extends Component {
  render () {
    return (
      <div>
        <nav className='navbar navbar-expand navbar-dark bg-dark'>
          <a href='/' className='navbar-brand'>
            home
          </a>
          <div className='navbar-nav mr-auto'>
            <li className='nav-item'>
              <Link to='/' className='nav-link'>
                home again
              </Link>
            </li>
          </div>
        </nav>

        <div className='container mt-3'>
          <Switch>
            <Route exact path='/' component={GroupsList} />
            <Route path='/groups/:id' component={Group} />
          </Switch>
        </div>
      </div>
    )
  }
}

export default App
