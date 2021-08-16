import fetch from 'node-fetch'

/**
 * Get all commits for all projects of a group
 * Handling GET requests to endpoint /api/users/:username/groups/:id/commits
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next - Next middleware func
 * @response success gives 200 OK with JSON body
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

    // TODO HANDLE HOW MANY COMMITS YOU WANT HERE
    // CURRENTLY GETTING 20 MAX PER PROJECT DUE TO PAGINATION
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
          // returns array of commit objects
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
