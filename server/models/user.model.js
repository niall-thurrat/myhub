/**
 * user model
 * @author Niall Thurrat
 */

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
    default: false,
    trim: true
  }
}, { timestamps: true })

userSchema.path('password').validate(function (input) {
  return validate.isGoodPassword(input) &&
    validate.isCorrectLengthPassword(input)
})

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

// Compare hashed login password with database password
userSchema.methods.comparePassword = function (loginPassword) {
  return bcrypt.compare(loginPassword, this.password)
}

userSchema.path('username').validate(function (input) {
  return validate.isAlphaNumericOnly(input) &&
     validate.isCorrectLengthUsername(input)
})

userSchema.path('name').validate(function (input) {
  return validate.isSafe(input)
}, "You Cannot use the '$' Character")

userSchema.path('email').validate(function (input) {
  return validate.isSafe(input)
}, "You Cannot use the '$' Character")

const User = mongoose.model('User', userSchema)

export default User
