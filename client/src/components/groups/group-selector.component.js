import React, { Component } from 'react'
import GroupsService from '../../services/groups.service'
import { Link } from 'react-router-dom'

export default class GroupSelector extends Component {
  constructor (props) {
    super(props)
    this.handleChangeSearchName = this.handleChangeSearchName.bind(this)
    this.retrieveGroups = this.retrieveGroups.bind(this)
    this.setActiveGroup = this.setActiveGroup.bind(this)
    this.handleSearchName = this.handleSearchName.bind(this)

    this.state = {
      groups: [],
      currentGroup: null,
      currentIndex: -1,
      searchName: ''
    }
  }

  componentDidMount () {
    this.retrieveGroups()
  }

  handleChangeSearchName (e) {
    const searchName = e.target.value

    this.setState({
      searchName: searchName
    })
  }

  retrieveGroups () {
    GroupsService.getAll()
      .then(response => {
        this.setState({
          groups: response.data
        })
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

  handleSearchName () {
    GroupsService.findByName(this.state.searchName)
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
    const currentIndex = this.state.currentIndex
    const searchName = this.state.searchName
    const currentGroup = this.state.currentGroup

    return (
      <div className='list row content-pad'>

        <div className='col-md-8'>
          <div className='input-group mb-3'>
            <input
              type='text'
              className='form-control'
              placeholder='Search by group name'
              value={searchName}
              onChange={this.handleChangeSearchName}
            />
            <div className='input-group-append'>
              <button
                className='btn btn-primary m-0'
                type='button'
                onClick={this.handleSearchName}
              >
                Search
              </button>
            </div>
          </div>
        </div>

        <div className='col-md-6'>
          <h4>Groups List</h4>
          {groups ? (
            <ul className='list-group'>
              {groups &&
              groups.map((group, index) => (
                <li
                  className={
                    'list-group-item cursor-pointer ' +
                    (index === currentIndex ? 'active' : '')
                  }
                  onClick={() => this.setActiveGroup(group, index)}
                  key={index}
                >
                  {group.full_name}
                </li>
              ))}
            </ul>
          ) : (
            <p>No groups found. Check your profile page to ensure you are connected to your GitLab account.</p>
          )}
        </div>

        <div className='col-md-6'>
          {currentGroup ? (
            <div>
              <h4>Group</h4>
              <div>
                <label>
                  <strong>Full Name:</strong>
                </label>{' '}
                {currentGroup.full_name}
              </div>
              <div>
                <label>
                  <strong>Id:</strong>
                </label>{' '}
                {currentGroup.groupId}
              </div>
              <div>
                <label>
                  <strong>Description:</strong>
                </label>{' '}
                {currentGroup.description}
              </div>

              <Link
                to={'/groups/' + currentGroup.groupId}
                className='btn btn-primary'
              >
                Go To Dashboard
              </Link>
            </div>
          ) : (
            <div>
              <br />
              <p>Please click on a Group...</p>
            </div>
          )}
        </div>
      </div>
    )
  }
}
