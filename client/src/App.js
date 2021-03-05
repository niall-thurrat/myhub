import React, { Component } from 'react'
import { Switch, Route, Link } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'

import GroupsList from './components/groups-list.component'

class App extends Component {
  render () {
    return (
      <div>
        <nav className='navbar navbar-expand navbar-dark bg-dark'>
          <a href='/groups/list' className='navbar-brand'>
            Groups List
          </a>
          <div className='navbar-nav mr-auto'>
            <li className='nav-item'>
              <Link to='/groups/list' className='nav-link'>
                Groups List
              </Link>
            </li>
          </div>
        </nav>

        <div className='container mt-3'>
          <Switch>
            <Route exact path='/groups/list' component={GroupsList} />
          </Switch>
        </div>
      </div>
    )
  }
}

export default App
