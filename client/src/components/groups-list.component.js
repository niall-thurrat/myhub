import React, { Component } from 'react'
import GroupsListDataService from '../services/groups-list.service'

export default class GroupsList extends Component {
  constructor (props) {
    super(props)
    this.retrieveGroups = this.retrieveGroups.bind(this)

    this.state = {
      groups: []
    }
  }

  componentDidMount () {
    this.retrieveGroups()
  }

  retrieveGroups () {
    GroupsListDataService.getAll()
      .then(response => {
        this.setState({
          groups: response.data
        })
      })
      .catch(e => {
        console.log(e)
      })
  }

  render () {
    const groups = this.state.groups.data

    return (
      <div className='list row'>
        <div className='col-md-6'>
          <h4>Groups List</h4>

          <ul className='list-group'>
            {groups &&
              groups.map((group, index) => (
                <li className='list-group-item' key={index}>
                  {group.full_name}
                </li>
              ))}
          </ul>
        </div>
      </div>
    )
  }
}
