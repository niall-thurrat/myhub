import React, { useEffect, useState } from 'react'
import GroupsService from '../../services/groups.service'

const GroupSettings = props => {
  const [slackAppUrl, setSlackAppUrl] = useState('')
  const [slackTestResult, setSlackTestResult] = useState('not tested')
  const [projectsSettings, setProjectsSettings] = useState([])

  useEffect(() => {
    getSettings(props.group.groupId)
  }, [props.group.groupId])

  const getSettings = (groupId) => {
    GroupsService.getSettings(groupId)
      .then(response => {
        setSlackAppUrl(response.data.slackAppUrl)
        setProjectsSettings(response.data.projects)
      })
      .catch(error => console.error(error))
  }

  const onChangeSlackUrl = (e) => {
    setSlackAppUrl(e.target.value)
  }

  const handleSlackUrlUpdate = () => {
    const id = props.group.groupId
    const settings = {
      updateType: 'slackAppUrl',
      slackAppUrl: slackAppUrl
    }
    GroupsService.updateSettings(id, settings)
      .catch(error => console.error(error))
  }

  const handleSlackTest = () => {
    const id = props.group.groupId
    GroupsService.getSlackConnectionStatus(id)
      .then(res => {
        if (res.status === 200 && res.data.slackResponseStatus === 200) {
          setSlackTestResult('Connected: 200 OK')
        } else {
          setSlackTestResult(`Not connected: myHub response ${res.status}, slack response ${res.body.slackResponseStatus || '---'}`)
        }
      })
      .catch(error => {
        debugger // eslint-disable-line no-debugger
        console.error(error)
        setSlackTestResult('Not connected: myHub response not OK')
      })
  }

  const onChangeHookSecret = (index) => (e) => {
    const projects = [...projectsSettings]
    projects[index].webhookSecret = e.target.value
    setProjectsSettings(projects)
  }

  const handleHookSecretUpdate = (index, projectId) => {
    const groupId = props.group.groupId
    const secret = projectsSettings[index].webhookSecret
    const settings = {
      updateType: 'webhookSecret',
      projectId: projectId,
      webhookSecret: secret
    }
    GroupsService.updateSettings(groupId, settings)
      .catch(err => {
        console.error(err)
      })
  }

  const handleSlackNotificationsUpdate = (index, projectId, checked, type) => {
    const projects = [...projectsSettings]
    const groupId = props.group.groupId
    const settings = { projectId: projectId }

    if (type === 'push') {
      projects[index].slackNotifications.getPushEvents = checked
      settings.updateType = 'getPushEvents'
      settings.getPushEvents = checked
    } else if (type === 'release') {
      projects[index].slackNotifications.getReleaseEvents = checked
      settings.updateType = 'getReleaseEvents'
      settings.getReleaseEvents = checked
    }

    setProjectsSettings(projects)

    GroupsService.updateSettings(groupId, settings)
      .catch(err => {
        console.error(err)
      })
  }

  return (
    <div>
      <div className='card p-0 mt-0 shadow-none'>
        <div className='card-header font-weight-bold'>Slack App Settings</div>
        <div className='card-body bg-white'>
          <div className='input-group mb-3'>
            <div className='input-group-prepend'>
              <span className='input-group-text font-weight-bold bg-gray text-body' id='prepend1'>Slack webhook URL</span>
            </div>
            <input
              type='text'
              className='form-control'
              id='slackAppUrl'
              name='slackAppUrl'
              value={slackAppUrl}
              onChange={onChangeSlackUrl}
            />
            <div className='input-group-append'>
              <button
                type='submit'
                className='btn btn-primary m-0'
                onClick={handleSlackUrlUpdate}
              >
                Update
              </button>
            </div>
          </div>
          <div className='input-group mb-3'>
            <div className='input-group-prepend'>
              <span className='input-group-text font-weight-bold bg-gray text-body' id='slack-test'>Slack connection status</span>
            </div>
            <input
              readOnly
              type='text'
              className='form-control bg-white'
              id='slackTest'
              name='slackTest'
              value={slackTestResult}
            />
            <div className='input-group-append'>
              <button
                type='submit'
                className='btn btn-primary m-0'
                onClick={handleSlackTest}
              >
                Test
              </button>
            </div>
          </div>
        </div>
      </div>

      {(projectsSettings.length > 0) ? (
        <div className='card p-0 mt-0 shadow-none'>
          <div className='card-header font-weight-bold'>Project Notification Settings</div>
          <div className='card-body bg-white'>
            <p className='card-text text-body'>Secret tokens must be sent with webhooks. One webhook can be configured per GitLab project. This enables real-time updates to the project's data and notifications in the dashboard. It is also necessary for Slack notifications to work.</p>

            {projectsSettings.map((project, index) =>
              <div className='card p-0 mt-0 shadow-none' key={index}>
                <div className='card-header font-weight-bold bg-gray'>{project.name} ({project.id})</div>
                <div className='card-body bg-white'>
                  <div className='input-group mb-3'>
                    <div className='input-group-prepend'>
                      <span className='input-group-text bg-gray text-body' id={'prepend2-' + index}>Gitlab webhook secret token</span>
                    </div>
                    <input
                      type='text'
                      className='form-control'
                      id={'webhookSecret-' + index}
                      name={'webhookSecret-' + index}
                      value={project.webhookSecret || ''}
                      onChange={onChangeHookSecret(index)}
                    />
                    <div className='input-group-append'>
                      <button
                        type='submit'
                        className='btn btn-primary m-0'
                        onClick={() => handleHookSecretUpdate(index, project.id)}
                      >
                        Update
                      </button>
                    </div>
                  </div>
                  <h5>Slack notifications</h5>
                  <div className='form-check'>
                    <input
                      className='form-check-input'
                      type='checkbox'
                      id={'pushCheckBox-' + index}
                      checked={project.slackNotifications.getPushEvents}
                      onChange={e => handleSlackNotificationsUpdate(index, project.id, e.target.checked, 'push')}
                    />
                    <label className='form-check-label' htmlFor={'pushCheckBox-' + index}>Push events</label>
                  </div>
                  <div className='form-check'>
                    <input
                      className='form-check-input'
                      type='checkbox'
                      id={'releaseCheckBox-' + index}
                      checked={project.slackNotifications.getReleaseEvents}
                      onChange={e => handleSlackNotificationsUpdate(index, project.id, e.target.checked, 'release')}
                    />
                    <label className='form-check-label' htmlFor={'releaseCheckBox-' + index}>Release events</label>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      ) : (
        <div className='card bg-white p-0 mt-0 shadow-none'>
          <div className='card-header font-weight-bold'>Project Notification Settings</div>
          <div className='card-body'>
            <p className='card-text'>No projects available for settings. Maintainer access is required for GitLab projects to be able to set up webhooks.</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default GroupSettings
