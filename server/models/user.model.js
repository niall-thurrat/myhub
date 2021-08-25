import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import validate from '../lib/userValidation'

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 6,
    maxlength: 20
  },
  password: {
    type: String,
    required: true,
    trim: false,
    minlength: 8,
    maxlength: 40
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  name: {
    type: String,
    required: false,
    trim: true,
    minlength: 2,
    maxlength: 100
  },
  gitlabInstanceUrl: {
    type: String,
    required: false,
    trim: true
  },
  gitlabId: {
    type: Number,
    required: false,
    trim: true
  },
  gitlabToken: {
    type: String,
    required: false,
    trim: true
  },
  gitlabApiConnection: {
    type: Boolean,
    default: false
  },
  lastGroupViews: [
    {
      groupId: {
        type: Number,
        required: true
      },
      viewId: {
        type: String,
        required: true
      },
      lastViewed: {
        type: Date,
        default: Date.now
      }
    }
  ],
  currentViewId: {
    type: String,
    required: false,
    default: null,
    trim: true
  },
  settings: {
    slackAppUrl: {
      type: String,
      default: null
    },
    projects: [
      {
        id: {
          type: Number,
          required: true
        },
        name: {
          type: String,
          default: null
        },
        webhookSecret: {
          type: String,
          trim: false,
          default: null
        },
        slackNotifications: {
          getPushEvents: {
            type: Boolean,
            default: false
          },
          getReleaseEvents: {
            type: Boolean,
            default: false
          }
        }
      }
    ]
  }
}, { timestamps: true })

// using pre-hook to salt and hash password
userSchema.pre('save', async function (next) {
  const user = this

  if (user.isModified('password') || user.isNew) {
    const salt = await bcrypt.genSalt(10)
    const hashPwd = await bcrypt.hash(user.password, salt)
    user.password = hashPwd
  }
  next()
})

userSchema.methods.comparePassword = function (loginPassword) {
  return bcrypt.compare(loginPassword, this.password)
}

userSchema.methods.compareHookSecret = async function (hookSecret, projectId) {
  const project = this.settings.projects.find(
    p => p.id === projectId
  )
  return project.webhookSecret === hookSecret
}

userSchema.path('username').validate(function (input) {
  return validate.isAlphaNumericOnly(input) &&
     validate.isCorrectLengthUsername(input)
})

userSchema.path('password').validate(function (input) {
  return validate.isGoodPassword(input) &&
    validate.isCorrectLengthPassword(input)
})

userSchema.path('email').validate(function (input) {
  return validate.isSafe(input)
}, "You Cannot use the '$' Character")

userSchema.path('name').validate(function (input) {
  return validate.isSafe(input)
}, "You Cannot use the '$' Character")

const User = mongoose.model('User', userSchema)

export default User
