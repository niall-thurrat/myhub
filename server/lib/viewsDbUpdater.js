import User from '../models/user.model'

// TODO handle/log errors in all funcs

/**
 * controls users' view data in db
 *
 * @param {Object} req - request object
 */
export default async function updateViewsInDb (req) {
  const username = req.user.username
  const newViewId = req.originalUrl

  const currentViewId = await getCurrentViewId(username)

  if (isGroupView(newViewId)) await updateGroupViews(req)

  if (currentViewId !== null && isGroupView(currentViewId)) {
    updateLastViewed(username, currentViewId)
  }

  updateCurrentViewId(username, newViewId)
}

/**
 * gets a user's currentViewId value from db
 *
 * @param {String} username
 * @return {String} currentViewId
 */
async function getCurrentViewId (username) {
  const currentViewId = await User.findOne({
    username: username
  })
    .then(user => user.currentViewId
      , err => console.error(err)
    )
  return currentViewId
}

/**
 * update or create a user's currentViewId value in db
 *
 * @param {String} username
 * @param {String} currentViewId
 */
function updateCurrentViewId (username, currentViewId) {
  User.findOneAndUpdate({ username: username },
    { currentViewId: currentViewId },
    err => console.error(err))
}

/**
 * updates a user's lastGroupViews array in db
 *
 * @param {Object} req - request object
 */
function updateGroupViews (req) {
  const username = req.user.username
  const viewId = req.originalUrl
  const groupId = req.params.id

  const viewsObj = {
    groupId: groupId,
    viewId: viewId,
    lastViewed: new Date()
  }

  User.findOne({
    username: username,
    lastGroupViews: { $elemMatch: { viewId: viewId } }
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
          'lastGroupViews.viewId': viewId
        }, {
          $set: { 'lastGroupViews.$.lastViewed': new Date() }
        }, err => console.error(err)
        )
      }
    })
}

/**
 * update lastViewed prop of a User.LastGroupViews array item in db
 *
 * @param {String} username
 * @param {String} viewId
 */
function updateLastViewed (username, viewId) {
  User.update({
    username: username,
    'lastGroupViews.viewId': viewId
  }, {
    $set: { 'lastGroupViews.$.lastViewed': new Date() }
  }, err => console.error(err)
  )
}

/**
 * Check viewId to see if user is viewing a group (dashboard)
 *
 * @param {Object} viewId - a request url path (req.originalUrl)
 * @return {Boolean}
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
