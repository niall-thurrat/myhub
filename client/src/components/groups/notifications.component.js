/**
 * Notifications component
 * @author Niall Thurrat
 */

import React from 'react'
import { MDBNotification } from 'mdbreact'

const Notifications = props => {
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

  const doIcon = note => {
    switch (note.type) {
      case 'push':
        return 'text-primary'

      case 'release':
        return 'amber-text'

      default:
        return 'doIcon error'
    }
  }

  return (
    <div>
      {props.notifications ? (props.notifications.map((note, index) =>
        <MDBNotification
          key={index}
          show
          fade
          iconClassName={doIcon(note)}
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
  )
}

export default Notifications
