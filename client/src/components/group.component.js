import React, { Component } from 'react'
import GroupsListDataService from '../services/groups-list.service'

export default class Group extends Component {
  constructor (props) {
    super(props)
    this.getGroup = this.getGroup.bind(this)

    this.state = {
      currentGroup: {
        groupId: null,
        full_name: '',
        description: ''
      }
    }
  }

  componentDidMount () {
    this.getGroup(this.props.match.params.id)
  }

  getGroup (groupId) {
    GroupsListDataService.get(groupId)
      .then(response => {
        this.setState({
          currentGroup: response.data
        })
      })
      .catch(e => {
        console.log(e)
      })
  }

  // getCommits (groupId) {
  //   GroupsListDataService.get(groupId)
  //     .then(response => {
  //       this.setState({
  //         currentGroup: response.data
  //       })
  //     })
  //     .catch(e => {
  //       console.log(e)
  //     })
  // }

  render () {
    const currentGroup = this.state.currentGroup

    return (
      <div>
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
