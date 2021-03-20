/**
 * Routes index
 *
 * @author Niall Thurrat
 * @version 1.0.0
 */

'use strict'

// import rootRoutes from './root.routes'
import authRoutes from './auth.routes'
import userRoutes from './user.routes'

export const routes = {}

// routes.root = rootRoutes
routes.auth = authRoutes
routes.user = userRoutes
