import User from '../../models/user.model'
import fetch from 'node-fetch'
import createError from 'http-errors'

/**
  * Get test result for Slack app connection
  * GET /api/users/:username/groups/:id/settings/slack-test
  *
  * @param {Object} req
  * @param {Object} res
  * @param {Function} next
  */
const slackTestController = async (req, res, next) => {
  try {
    const username = req.user.username
    const user = await User.findOne({ username })
    const slackAppUrl = user.settings.slackAppUrl
    const body = { text: 'myHub test message for Slack app' }
    const params = {
      method: 'post',
      body: JSON.stringify(body)
    }

    const resStatus = await fetch(slackAppUrl, params)
      .then(res => res.status)
      .catch(error =>
        next(createError(error))
      )

    const testReult = { slackResponseStatus: resStatus }
    res.status(200).json(testReult)
  } catch (error) {
    next(error)
  }
}

export default slackTestController
