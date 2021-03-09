import React, { Component } from 'react'
import GroupsListDataService from '../services/groups-list.service'

export default class Group extends Component {
  constructor (props) {
    super(props)
    this.getGroup = this.getGroup.bind(this)

    this.state = {
      currentGroup: {
        id: null,
        full_name: ''
      }
    }
  }

  componentDidMount () {
    this.getGroup(this.props.match.params.id)
  }

  getGroup (id) {
    GroupsListDataService.get(id)
      .then(response => {
        this.setState({
          currentGroup: response.data
        })
        console.log(response.data)
      })
      .catch(e => {
        console.log(e)
      })
  }

  render () {
    const currentTutorial = this.state.currentTutorial

    return (
      <div>
        {currentTutorial ? (
          <div className='edit-form'>
            <h4>Group</h4>
            <form>
              <div className='form-group'>
                <label htmlFor='group'>Group Name</label>
                <input
                  type='text'
                  className='form-control'
                  id='full_name'
                  value={currentTutorial.full_name}
                />
              </div>
              <div className='form-group'>
                <label htmlFor='id'>ID</label>
                <input
                  type='text'
                  className='form-control'
                  id='id'
                  value={currentTutorial.id}
                />
              </div>
            </form>
          </div>
        ) : (
          <div>
            <br />
            <p>Please click on a Group...</p>
          </div>
        )}
      </div>
    )
  }
}
