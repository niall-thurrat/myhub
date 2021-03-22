/**
 * Routes index
 *
 * @author Niall Thurrat
 * @version 1.0.0
 */

// import rootRoutes from './root.routes'
import authRoutes from './auth.routes'
import userRoutes from './user.routes'
import hookRoutes from './hook.routes'

export const routes = {}

// routes.root = rootRoutes
routes.auth = authRoutes
routes.user = userRoutes
routes.hook = hookRoutes
