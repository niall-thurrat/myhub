/**
 * Notifications component
 * @author Niall Thurrat
 */

import React, { useState, useEffect } from 'react'
import { MDBNotification } from 'mdbreact'

const Notifications = props => {
  const [newNotes, setNewNotes] = useState(undefined)
  const [oldNotes, setOldNotes] = useState(undefined)

  useEffect(() => {
    const lastViewed = props.lastViewed
    const notes = props.notes
    const newNoteArray = []
    const oldNoteArray = []

    if (notes !== (null || undefined)) {
      // sort notifications newest first
      notes.sort(function compare (a, b) {
        var dateA = new Date(a.gitlabCreatedAt || a.createdAt)
        var dateB = new Date(b.gitlabCreatedAt || b.createdAt)
        return dateB - dateA
      })

      // add to oldNotes or newNotes
      notes.forEach(n => {
        if ((n.gitlabCreatedAt || n.createdAt) > lastViewed) {
          newNoteArray.push(n)
        } else oldNoteArray.push(n)
      })

      if (newNoteArray[0]) setNewNotes(newNoteArray)
      if (oldNoteArray[0]) setOldNotes(oldNoteArray)
    }
  }, [props])

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
      <div>
        <a className='btn btn-primary fa-fw'> {/* href='path/to/settings' aria-label='Delete' */}
          <i className='fa fa-trash' aria-hidden='true'>&nbsp; Clear notifications</i>
        </a>
      </div>

      <div>
        <p align='center'>--- new ---</p>
      </div>

      <div>
        {newNotes ? (
          newNotes.map((note, index) =>
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
            <p>You're up to date!</p>
          </div>
        )}
      </div>

      <div>
        <p align='center'>--- old ---</p>
      </div>

      <div>
        {oldNotes ? (
          oldNotes.map((note, index) =>
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
            <p>Nothing to see here!</p>
          </div>
        )}
      </div>

    </div>
  )
}

export default Notifications
