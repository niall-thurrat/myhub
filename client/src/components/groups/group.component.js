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
import ReleaseTable from './release-table.component'
import CommitsTable from './commits-table.component'

const SOCKET_SERVER = 'http://localhost:8080'

const Group = props => {
  const initialGroupState = {
    groupId: null,
    full_name: '',
    description: ''
  }

  const [currentGroup, setCurrentGroup] = useState(initialGroupState)
  const [commits, setCommits] = useState(undefined)
  const [releases, setReleases] = useState(undefined)

  useEffect(() => {
    getGroup(props.match.params.id)
    getCommits(props.match.params.id)
    getReleases(props.match.params.id)

    const socket = socketIOClient(SOCKET_SERVER)

    socket.on('commitData', data => {
      setCommits(data) // TODO sort out 20 limit on pagination server side
    })

    socket.on('releaseData', data => {
      setReleases(data) // TODO sort out 20 limit on pagination server side
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

  const getReleases = groupId => {
    GroupsService.getReleases(groupId)
      .then(response => {
        setReleases(response.data)
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
        <br />
      </div>

      <div>
        {commits ? (
          <div>
            <CommitsTable commits />
            <br />
          </div>
        ) : (
          <div>
            <br />
            <p>No commit data found...</p>
          </div>
        )}
      </div>

      <div>
        {releases ? (
          <div>
            <ReleaseTable releases />
            <br />
          </div>
        ) : (
          <div>
            <br />
            <p>No release data found...</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Group
