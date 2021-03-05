/**
 * Root controller
 *
 * @author Niall Thurrat
 * @version 1.0.0
 */

'use strict'

const rootController = (req, res) => {
  res.status(200).json({
    status: 'root Controller API call successfully'
  })
}

export default rootController
