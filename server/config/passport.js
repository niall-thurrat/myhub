/**
 * Passport configuration
 *
 * @author Niall Thurrat
 * @credits got a bit of help from Chris Rutherford on this one:
 * https://medium.com/@therealchrisrutherford/nodejs-authentication-with-passport-and-jwt-in-express-3820e256054f
 */

import { Strategy, ExtractJwt } from 'passport-jwt'
import User from '../models/user.model'
import dotenv from 'dotenv'

dotenv.config()

const secret = process.env.AUTH_SECRET || 'some other secret as default'

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: secret
}

export default passport => {
  passport.use(
    new Strategy(opts, (payload, done) => {
      User.findById(payload.id)
        .then(user => {
          if (user) {
            return done(null, {
              id: user.id,
              name: user.name,
              username: user.username,
              emailAddress: user.emailAddress,
              gitlabToken: user.gitlabToken
            })
          }
          return done(null, false)
        }).catch(err => console.error(err))
    })
  )
}
