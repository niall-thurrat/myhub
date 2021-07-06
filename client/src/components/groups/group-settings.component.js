/**
 * Group settings component
 * @author Niall Thurrat
 */

import React from 'react'

const GroupSettings = props => {
  return (
    <div>
      {props.group ? (
        <div>
          <div>
            <h5>Slack notification settings</h5>
            <p>Here you see a list of all GitLab events for all projects within this group that you can switch Slack notifications on for. Remember that you need to set up the app in slack yourself.</p>
          </div>
          <div>
            <p>group data test - full_name: {props.group.full_name}</p>
          </div>
        </div>
      ) : (
        <div>
          <br />
          <p>No group data found...</p>
        </div>
      )}
      <br />
    </div>
  )
}

export default GroupSettings
