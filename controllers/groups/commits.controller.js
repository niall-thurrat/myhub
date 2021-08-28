import fetch from 'node-fetch'

/**
 * Get all commits for all projects of a group
 * GET /api/users/:username/groups/:id/commits
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 *
 */
const commitsController = async (req, res, next) => {
  try {
    const token = req.user.gitlabToken
    const url = req.user.gitlabInstanceUrl
    const groupId = req.params.id
    const projectsUrl = `${url}/api/v4/groups/${groupId}/projects`
    const params = { headers: { 'PRIVATE-TOKEN': token } }
    const commitsJson = { commits: [] }

    // get project ids of a group
    const ids = await fetch(projectsUrl, params)
      .then(res => res.json())
      .then(projects => projects.map(p => p.id))

    const requests = ids.map(id => fetch(
        `${url}/api/v4/projects/${id}/repository/commits`, params
    ))

    // gets an array of arrays with commit objects
    const data = await Promise.all(requests)
      .then(responses => Promise.all(
        responses.map(r => r.json())
      ))
      .then(resJsons => Promise.all(
        resJsons.map((resJson, index) => {
          // put project_id in each commit obj
          resJson.forEach(commit => {
            commit.project_id = ids[index]
          })
          return resJson
        })
      ))

    // push all commits to single array
    data.forEach(array => {
      array.forEach(commitObj => {
        commitsJson.commits.push(commitObj)
      })
    })

    res.status(200).json(commitsJson)
  } catch (error) {
    next(error)
  }
}

export default commitsController
