/**
 * Group component
 *
 * @author Niall Thurrat
 * @credits Got help from bezkoder for this one:
 * https://bezkoder.com/react-crud-web-api/
 */

import React, { useState, useEffect } from 'react'
import GroupsService from '../../services/groups.service'
import socketIOClient from 'socket.io-client'

const SOCKET_SERVER = 'http://localhost:8080'

const Group = props => {
  const initialGroupState = {
    groupId: null,
    full_name: '',
    description: ''
  }

  const [currentGroup, setCurrentGroup] = useState(initialGroupState)
  const [commits, setCommits] = useState(undefined)
  const [response, setResponse] = useState({ id: 'change me' })

  useEffect(() => {
    getGroup(props.match.params.id)
    getCommits(props.match.params.id)

    const socket = socketIOClient(SOCKET_SERVER)
    socket.on('releaseData', data => {
      setResponse(data)
    })

    return () => socket.disconnect()
  }, [props.match.params.id])

  const getGroup = groupId => {
    GroupsService.get(groupId)
      .then(response => {
        setCurrentGroup(response.data)
      })
      .catch(e => {
        console.log(e)
      })
  }

  const getCommits = groupId => {
    GroupsService.getCommits(groupId)
      .then(response => {
        setCommits(response.data)
      })
      .catch(e => {
        console.log(e)
      })
  }

  return (
    <div>
      <div>
        <h4>Group Dashboard</h4>
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
      <div>
        <div>
          <p>Response: {response.id}</p>
        </div>
        {commits ? (
          <div>
            <h4>Commits</h4>
            <div>
              <label>
                <strong>Project 1 id:</strong>
              </label>{' '}
              {commits.data[0].projectId}
            </div>
            <div>
              <label>
                <strong>Project 1 commit 1:</strong>
              </label>{' '}
              {commits.data[0].commits[0].title}
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

export default Group
