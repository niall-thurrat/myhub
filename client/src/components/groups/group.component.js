/**
 * Group component
 *
 * @author Niall Thurrat
 * @credits Got help from bezkoder for this one:
 * https://bezkoder.com/react-crud-web-api/
 */

import React, { Component } from 'react'
import GroupsService from '../../services/groups.service'

export default class Group extends Component {
  constructor (props) {
    super(props)
    this.getGroup = this.getGroup.bind(this)

    this.state = {
      currentGroup: {
        groupId: null,
        full_name: '',
        description: ''
      },
      groupCommits: null
    }
  }

  componentDidMount () {
    this.getGroup(this.props.match.params.id)
    this.getCommits(this.props.match.params.id)
  }

  getGroup (groupId) {
    GroupsService.get(groupId)
      .then(response => {
        this.setState({
          currentGroup: response.data
        })
      })
      .catch(e => {
        console.log(e)
      })
  }

  getCommits (groupId) {
    GroupsService.getCommits(groupId)
      .then(response => {
        this.setState({
          groupCommits: response.data
        })
      })
      .catch(e => {
        console.log(e)
      })
  }

  render () {
    const currentGroup = this.state.currentGroup
    const groupCommits = this.state.groupCommits

    return (
      <div>
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
        <div>
          {groupCommits ? (
            <div>
              <h4>Commits</h4>
              <div>
                <label>
                  <strong>Project 1 id:</strong>
                </label>{' '}
                {groupCommits.data[0].projectId}
              </div>
              <div>
                <label>
                  <strong>Project 1 commit 1:</strong>
                </label>{' '}
                {groupCommits.data[0].commits[0].title}
              </div>
            </div>
          ) : (
            <div>
              <br />
              <p>Error: No commit data found...</p>
            </div>
          )}
        </div>
      </div>
    )
  }
}
