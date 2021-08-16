/* eslint no-prototype-builtins: "off" */

/**
 * Create a simple version of a GitLab group
 *
 * @param {Object} json a GitLab group json object
 * @return {Object} newJson - simplified GitLab group object
 *
 */
export function simplifyGroup (json) {
  const newJson = {}

  newJson.groupId = json.id
  newJson.full_name = json.full_name
  newJson.description = json.description

  return newJson
}

/**
 * Reduce a URL to protocol + host only
 *
 * @param {String} url - a url string
 * @return {String} url string minus everything after host
 */
export function removeUrlPath (url) {
  return url.split('/').slice(0, 3).join('/')
}

/**
 * Check an object for nested properties
 *
 * @credits got this from
 * https://stackoverflow.com/questions/2631001/test-for-existence-of-nested-javascript-object-key
 * @param {Object} obj - object to be checked
 * @param {String} level, ...rest - any number of nested keys of obj
 * @return {Bool}
 */
export function checkNested (obj, level, ...rest) {
  if (obj === undefined) return false
  if (rest.length === 0 && obj.hasOwnProperty(level)) return true
  return checkNested(obj[level], ...rest)
}

export default {
  simplifyGroup,
  removeUrlPath,
  checkNested
}
