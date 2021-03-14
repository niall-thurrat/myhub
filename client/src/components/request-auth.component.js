import React, { Component } from 'react'
import { RequestAuthorizationCode } from 'react-oauth2-auth-code-flow'
import ClientOAuth2 from 'client-oauth2'

const oauthClient = new ClientOAuth2({
  clientId: process.env.REACT_APP_APP_ID,
  clientSecret: process.env.REACT_APP_CLIENT_SECRET,
  accessTokenUri: 'https://gitlab.lnu.se/oauth/token',
  authorizationUri: 'https://gitlab.lnu.se/oauth/authorize',
  redirectUri: 'http://localhost:3000/auth/gitlab',
  scopes: ['api']
})

export default class SendToGitLab extends Component {
  render () {
    return (
      <RequestAuthorizationCode
        oauthClient={oauthClient}
        state={process.env.REACT_APP_STATE}
        render={({ url }) => <a href={url}>Connect to GitLab</a>}
      />
    )
  }
}
