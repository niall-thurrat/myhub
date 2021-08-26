import React, { useState, useEffect } from 'react'
import { MDBNotification } from 'mdbreact'
import GroupsService from '../../services/groups.service'

const Notifications = props => {
  const [newNotes, setNewNotes] = useState([])
  const [oldNotes, setOldNotes] = useState([])

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

      if (newNoteArray.length > 0) setNewNotes(newNoteArray)
      if (oldNoteArray.length > 0) setOldNotes(oldNoteArray)
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
        return ''
    }
  }

  const handleRemoveAllButton = () => {
    const id = props.groupId
    const noteIds = props.notes.map(note => note._id)
    const reqBody = {
      isActive: false,
      notificationIds: noteIds
    }

    GroupsService.removeNotifications(id, reqBody)
      .then(res => {
        if (res.status === 204) {
          props.onChange([])
          setNewNotes([])
          setOldNotes([])
        }
      })
      .catch(err => {
        console.error(err)
      })
  }

  const handleRemoveOneButton = (noteId) => {
    const groupId = props.groupId
    const reqBody = { isActive: false }

    GroupsService.removeNotification(groupId, noteId, reqBody)
      .catch(err => {
        console.error(err)
      })
  }

  return (
    <div>
      <div>
        <a className='btn btn-primary fa-fw' onClick={handleRemoveAllButton}>
          <i className='fa fa-trash' aria-hidden='true'>&nbsp; Clear notifications</i>
        </a>
      </div>

      <div>
        <p align='center'>--- new ---</p>
      </div>

      <div>
        {(newNotes.length > 0) ? (
          newNotes.map((note, index) =>
            <MDBNotification
              key={index}
              show
              fade
              iconClassName={doIcon(note)}
              title={`${note.type} event`}
              text={doTimeDate(note)}
              message={doMessage(note)}
              onClick={() => handleRemoveOneButton(note._id)}
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
        {(oldNotes.length > 0) ? (
          oldNotes.map((note, index) =>
            <MDBNotification
              key={index}
              show
              fade
              iconClassName={doIcon(note)}
              title={`${note.type} event`}
              text={doTimeDate(note)}
              message={doMessage(note)}
              onClick={() => handleRemoveOneButton(note._id)}
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
