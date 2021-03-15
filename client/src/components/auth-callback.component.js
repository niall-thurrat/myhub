import React, { Component } from 'react'
import { AuthorizationCodeCallback } from 'react-oauth2-auth-code-flow'
import ClientOAuth2 from 'client-oauth2'

const oauthClient = new ClientOAuth2({
  clientId: process.env.REACT_APP_APP_ID,
  clientSecret: process.env.REACT_APP_CLIENT_SECRET,
  accessTokenUri: 'https://gitlab.lnu.se/oauth/token',
  authorizationUri: 'https://gitlab.lnu.se/oauth/authorize',
  redirectUri: 'http://localhost:3000/auth/gitlab',
  scopes: ['api']
})

export default class ReceiveFromGitLab extends Component {
  constructor (props) {
    super(props)
    this.handleSuccess = this.handleSuccess.bind(this)
    this.handleError = this.handleError.bind(this)
  }

  componentDidMount () {}

  async handleSuccess (accessToken, { response, state }) {
    console.log('Successfully authorized')
    // await setProfileFromDropbox(accessToken);
    // await redirect(state.from)
  }

  handleError (error) {
    console.error('An error occurred')
    console.error(error.message)
  }

  render () {
    return (
      <AuthorizationCodeCallback
        oauthClient={oauthClient}
        onAuthSuccess={this.handleSuccess}
        onAuthError={this.handleError}
        render={({ processing, state, error }) => (
          <div>
            {processing && <p>Authorizing now...</p>}
            {error && (
              <p className='error'>An error occurred: {error.message}</p>
            )}
          </div>
        )}
      />
    )
  }
}
