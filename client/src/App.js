import React, { Component } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'

class App extends Component {
  render () {
    return (
      <div>
        <nav className='navbar navbar-expand navbar-dark bg-dark'>
          <a href='/groups' className='navbar-brand'>
            Groups
          </a>
          <div className='navbar-nav mr-auto'>
            <li className='nav-item'>
              <Link to='/groups/list' className='nav-link'>
                Groups List
              </Link>
            </li>
            <li className='nav-item'>
              <Link to='/root' className='nav-link'>
                Root
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
