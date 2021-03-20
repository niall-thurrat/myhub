/**
 * Webhooks controller
 *
 * @author Niall Thurrat
 * @version 1.0.0
 */

'use strict'

// import User from '../../models/user.model'
// import createError from 'http-errors'

/**
   * Get user
   * Handling POST requests to endpoint /api/hooks
   *
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next - Next middleware func
   * @response success gives 200 OK with JSON body
   *
   */
const hookController = async (req, res, next) => {
  const resBody = req.body
  console.log('Im here')
  res.status(200).json(resBody)
}

export default hookController
