import React, { Component } from 'react'
import GroupsListDataService from '../services/groups-list.service'

export default class GroupsList extends Component {
  constructor (props) {
    super(props)
    this.retrieveGroups = this.retrieveGroups.bind(this)

    this.state = {
      groups: [],
      currentIndex: -1
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
        console.log(response.data)
      })
      .catch(e => {
        console.log(e)
      })
  }

  setActiveGroup (group, index) {
    this.setState({
      currentGroup: group,
      currentIndex: index
    })
  }

  render () {
    const { groups, currentIndex } = this.state

    return (
      <div className='list row'>
        <div className='col-md-6'>
          <h4>Groups List</h4>

          <ul className='list-group'>
            {groups &&
              groups.map((group, index) => (
                <li
                  className={
                    'list-group-item ' +
                    (index === currentIndex ? 'active' : '')
                  }
                  onClick={() => this.setActiveGroup(group, index)}
                  key={index}
                >
                  {group.title}
                </li>
              ))}
          </ul>
        </div>
      </div>
    )
  }
}
