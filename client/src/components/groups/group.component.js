import React, { useState, useEffect } from 'react'
import GroupsService from '../../services/groups.service'
import socketIOClient from 'socket.io-client'
import CommitsTable from './commits-table.component'
import ReleasesTable from './releases-table.component'
import GroupSettings from './group-settings.component'
import Notifications from './notifications.component'

const Group = props => {
  const SOCKET_SERVER = 'http://localhost:8080'
  const GROUP_ID = props.match.params.id

  const initialGroupState = {
    groupId: null,
    full_name: '',
    description: ''
  }

  const [view, setView] = useState('Dashboard')
  const [currentGroup, setCurrentGroup] = useState(initialGroupState)
  const [commits, setCommits] = useState(undefined)
  const [releases, setReleases] = useState(undefined)
  const [notifications, setNotifications] = useState(undefined)
  const [lastViewed, setLastViewed] = useState(undefined)

  useEffect(() => {
    const socket = socketIOClient(SOCKET_SERVER)

    getGroup(GROUP_ID)
    getCommits(GROUP_ID)
    getReleases(GROUP_ID)
    getNotifications(GROUP_ID)

    socket.on('commitData', newCommits => {
      setCommits(prevCommits => {
        const joinedArray = prevCommits.concat(newCommits.commits)

        return joinedArray.sort(function (a, b) {
          return new Date(b.created_at) - new Date(a.created_at)
        })
      })
    })

    socket.on('releaseData', newRelease => {
      setReleases(prevReleases => {
        const joinedArray = prevReleases.concat(newRelease.release)

        return joinedArray.sort(function (a, b) {
          return new Date(b.created_at) - new Date(a.created_at)
        })
      })
    })

    socket.on('notesData', newNote => {
      setNotifications(prevNotes => {
        return prevNotes.concat(newNote)
      })
    })

    return () => socket.disconnect()
  }, [GROUP_ID])

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
        setCommits(response.data.commits)
      })
      .catch(e => {
        console.log(e)
      })
  }

  const getReleases = groupId => {
    GroupsService.getReleases(groupId)
      .then(response => {
        setReleases(response.data.releases)
      })
      .catch(e => {
        console.log(e)
      })
  }

  const getNotifications = groupId => {
    GroupsService.getNotifications(groupId)
      .then(response => {
        setNotifications(response.data.notifications)
        setLastViewed(response.data.lastViewed)
      })
      .catch(e => {
        console.log(e)
      })
  }

  const handleDashButton = () => {
    setView('Dashboard')
  }

  const handleSettingsButton = () => {
    setView('Settings')
  }

  const handleRemovedNotifications = newArr => {
    setNotifications(newArr)
  }

  return (
    <div>
      <div className='container mt-3 float-left w-75  p-1'>
        <div>
          <div className='row-space'>
            <div>
              <h4>Group {view}</h4>
            </div>
            <div>
              <button
                className='btn btn-default' title='view group dashboard'
                onClick={handleDashButton}
              >
                <i className='fa fa-desktop' aria-hidden='true' />
              </button>
              <button
                className='btn btn-default' title='view group settings'
                onClick={handleSettingsButton} aria-label='Settings'
              >
                <i className='fa fa-cog' aria-hidden='true' />
              </button>
            </div>
          </div>

          <div>
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
          <br />
        </div>

        {view === 'Dashboard' ? (
          <div>
            <CommitsTable commits={commits} />
            <ReleasesTable releases={releases} />
          </div>
        ) : (
          <div>
            <GroupSettings group={currentGroup} />
          </div>
        )}

      </div>

      <div className='container mt-3 float-right w-25 p-1'>
        <Notifications
          groupId={currentGroup.groupId}
          notes={notifications}
          lastViewed={lastViewed}
          onChange={handleRemovedNotifications}
        />
      </div>

    </div>
  )
}

export default Group
