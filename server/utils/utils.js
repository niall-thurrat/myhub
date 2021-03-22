/**
 * Utility functions
 * @author Niall Thurrat
 */

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

export default { simplifyGroup }
