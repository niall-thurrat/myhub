import Notification from '../../models/notification.model'
import createError from 'http-errors'

/**
   * Edit a notification for a specific user
   * PATCH /api/users/:username/groups/:id/notifications/:note_id
   *
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
const notificationController = async (req, res, next) => {
  try {
    const username = req.user.username
    const noteId = req.params.note_id
    const isActive = req.body.isActive

    if (isActive === false) {
      Notification.updateOne(
        { username: username, _id: noteId, isActive: true },
        { isActive: false },
        err => {
          if (err) {
            console.error(err)
            next(createError(400, err.message))
          } else {
            res.status(204).send()
          }
        })
    } else {
      next(createError(400,
        'isActive must be false to deactivate notifications'))
    }
  } catch (error) {
    next(error)
  }
}

export default notificationController
