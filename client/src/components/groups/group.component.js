/**
 * Group component
 *
 * @author Niall Thurrat
 * @credits Got help from bezkoder for this one:
 * https://bezkoder.com/react-crud-web-api/
 */

import React, { useMemo, useState, useEffect } from 'react'
import GroupsService from '../../services/groups.service'
import socketIOClient from 'socket.io-client'
import Table from './table.component'
import { MDBNotification } from 'mdbreact'

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
  const [notifications, setNotifications] = useState(undefined)

  useEffect(() => {
    const id = props.match.params.id
    const socket = socketIOClient(SOCKET_SERVER)

    getGroup(id)
    getCommits(id)
    getReleases(id)
    getNotifications(id)

    // TODO sort then take most recent 20 commits - how to do
    // this so that commits state continues to affect table?

    // TODO sort out 20 limit on pagination server side
    socket.on('commitData', newCommits => {
      setCommits(prevCommits => {
        const joinedArray = prevCommits.concat(newCommits.data)

        return joinedArray.sort(function (a, b) {
          return new Date(b.created_at) - new Date(a.created_at)
        })
      })
    })

    // TODO sort out 20 limit on pagination server side
    socket.on('releaseData', newRelease => {
      setReleases(prevReleases => {
        const joinedArray = prevReleases.concat(newRelease.data)

        return joinedArray.sort(function (a, b) {
          return new Date(b.created_at) - new Date(a.created_at)
        })
      })
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
        setCommits(response.data.data)
      })
      .catch(e => {
        console.log(e)
      })
  }

  const getReleases = groupId => {
    GroupsService.getReleases(groupId)
      .then(response => {
        setReleases(response.data.data)
      })
      .catch(e => {
        console.log(e)
      })
  }

  const getNotifications = groupId => {
    GroupsService.getNotifications(groupId)
      .then(response => {
        setNotifications(response.data.data)
        console.log('ok to here')
        console.log(response.data.data)
      })
      .catch(e => {
        console.log(e)
      })
  }

  const commitsColumns = useMemo(
    () => [
      {
        Header: 'Commits for all group projects (max 20 per project just now)',
        columns: [
          {
            Header: 'commit id',
            accessor: 'id'
          },
          {
            Header: 'author',
            accessor: 'author_name'
          },
          {
            Header: 'message',
            accessor: 'message'
          },
          {
            Header: 'when',
            accessor: 'created_at'
          },
          {
            Header: 'project id',
            accessor: 'project_id'
          }
        ]
      }
    ],
    []
  )

  const releasesColumns = useMemo(
    () => [
      {
        Header: 'releases for all group projects (max 20 per project just now)',
        columns: [
          {
            Header: 'tag',
            accessor: 'tag_name'
          },
          {
            Header: 'name',
            accessor: 'name'
          },
          {
            Header: 'description',
            accessor: 'description'
          },
          {
            Header: 'when',
            accessor: 'created_at'
          },
          {
            Header: 'project id',
            accessor: 'project_id'
          }
        ]
      }
    ],
    []
  )

  const doTimeDate = note => {
    const date = note.gitlabCreatedAt || note.createdAt

    return new Date(date).toLocaleTimeString() + ' - ' +
      new Date(date).toLocaleDateString()
  }

  const doMessage = note => {
    switch (note.type) {
      case 'push':
        return `${note.gitlabCreatedBy} has pushed ` +
          `${note.pushCommitsCount} commits to ${note.gitlabProjectName}`

      case 'release':
        return `Release ${note.releaseTag} has been made for ` +
          note.gitlabProjectName

      default:
        return 'doMessage error'
    }
  }

  return (
    <div>
      <div className='container mt-3 float-left w-75'>
        <div>
          <h4>Group Dashboard</h4>
          <p>
            <strong>Full Name: </strong>
            {currentGroup.full_name}
          </p>
          <p>
            <strong>Id: </strong>
            {currentGroup.groupId}
          </p>
          <p>
            <strong>Description: </strong>
            {currentGroup.description}
          </p>
        </div>

        <div>
          {commits ? (
            <div>
              <Table
                columns={commitsColumns}
                data={commits}
              />
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
              <Table
                columns={releasesColumns}
                data={releases}
              />
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

      <div className='container mt-3 float-right w-25 p-1'>
        {notifications ? (notifications.map((note) =>
          <MDBNotification
            key={note}
            show
            fade
            iconClassName='text-primary'
            title={`${note.type} event`}
            text={doTimeDate(note)}
            message={doMessage(note)}
          />
        )
        ) : (
          <div>
            <br />
            <p>No new notifications!</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Group
