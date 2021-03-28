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

    // TODO sort then take most recent 20 commits - how to do
    // this so that commits state continues to affect table?

    // TODO sort out 20 limit on pagination server side
    socket.on('commitData', newCommits => {
      // console.log(`sortedArray: ${sortedArray}`)
      setCommits(prevCommits => {
        const joinedArray = prevCommits.concat(newCommits.data)

        return joinedArray.sort(function (a, b) {
          return new Date(b.created_at) - new Date(a.created_at)
        })
      })
    })

    // TODO sort out 20 limit on pagination server side
    socket.on('releaseData', data => {
      setReleases(data)
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

  const commitsColumns = useMemo(
    () => [
      {
        Header: 'Last 20 commits',
        columns: [
          {
            Header: 'project_id',
            accessor: 'project_id'
          },
          {
            Header: 'author_name',
            accessor: 'author_name'
          },
          {
            Header: 'message',
            accessor: 'message'
          },
          {
            Header: 'created_at',
            accessor: 'created_at'
          },
          {
            Header: 'id',
            accessor: 'id'
          }
        ]
      }
    ],
    []
  )

  return (
    <div>
      <div>
        {currentGroup ? (
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
        ) : (
          <div>
            <br />
            <p>Authorization required for
              group data... please login
            </p>
          </div>
        )}
      </div>

      <div>
        {commits ? (
          <div>
            <CommitsTable
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
