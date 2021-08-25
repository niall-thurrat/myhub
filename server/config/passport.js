import { Strategy, ExtractJwt } from 'passport-jwt'
import User from '../models/user.model'
import dotenv from 'dotenv'

dotenv.config()

const secret = process.env.JWT_SECRET

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
              email: user.email,
              gitlabToken: user.gitlabToken,
              gitlabInstanceUrl: user.gitlabInstanceUrl
            })
          }
          return done(null, false)
        }).catch(err => console.error(err))
    })
  )
}
