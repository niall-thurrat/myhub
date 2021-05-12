/**
 * updates user views in the database
 * @author Niall Thurrat
 */

import User from '../models/user.model'

/**
 * updates a user's lastGroupViews array in db
 *
 * @param {Object} req - request object
 */
export default async function updateGroupViewsInDb (req) {
  const username = req.user.username
  const viewId = req.originalUrl
  const groupId = req.params.id

  const viewsObj = {
    groupId: groupId,
    viewId: viewId,
    lastViewed: new Date()
  }

  // check if user is viewing a group (i.e. a group dashboard view)
  if (!isGroupView(viewId)) return

  // TODO log errors
  User.findOne({
    username: username,
    lastGroupViews: { $elemMatch: { groupId: groupId } }
  })
    .then(user => {
      if (!user) {
        User.findOneAndUpdate({ username: username }, {
          $push: { lastGroupViews: viewsObj }
        }, err => console.error(err)
        )
      } else {
        User.update({
          username: username,
          'lastGroupViews.groupId': groupId
        }, {
          $set: { 'lastGroupViews.$.lastViewed': new Date() }
        }, err => console.error(err)
        )
      }
    })
}

/**
 * Check viewId to see if user is viewing a group (dashboard)
 *
 * @param {Object} viewId - a request url path (req.originalUrl)
 * @return {Bool}
 */
function isGroupView (viewId) {
  const splitViewId = viewId.split('/')
  // TODO check how gitlab group ids are formatted
  // I assume they are 3-5 figure numbers here (e.g. 123, 1234 or 12345)
  const groupIdRegExp = /^[0-9]{3,5}$/

  const groupsCheck = (splitViewId[4] === 'groups')
  const groupIdCheck = groupIdRegExp.exec(splitViewId[5])

  return !!((groupsCheck && groupIdCheck))
}
