/**
 * notification model
 * @author Niall Thurrat
 */

import mongoose from 'mongoose'
require('mongoose-type-url')

const notificationSchema = mongoose.Schema({
  gitlabProjectId: {
    type: Number,
    required: true
  },
  gitlabProjectName: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  gitlabCreatedAt: {
    type: Date,
    required: false
  },
  gitlabCreatedBy: {
    type: String,
    required: false
  },
  gitlabInstanceUrl: {
    type: mongoose.SchemaTypes.Url,
    required: true
  },
  pushCommitsCount: {
    type: Number,
    required: false
  },
  releaseTag: {
    type: String,
    required: false
  }
}, { timestamps: true })

const Notification =
  mongoose.model('Notification', notificationSchema)

export default Notification
