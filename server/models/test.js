/**
 * test model
 *
 * @author Niall Thurrat
 * @version 1.0.0
 *
 */

'use strict'

import mongoose from 'mongoose'

const testSchema = mongoose.Schema({
  id: {
    type: String,
    required: true
  }
}, { timestamps: true })

export const Test = mongoose.model('test', testSchema)
