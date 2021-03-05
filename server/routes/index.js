/**
 * Routes index
 *
 * @author Niall Thurrat
 * @version 1.0.0
 */

'use strict'

import rootRouter from './rootRouter'
import groupsRouter from './groupsRouter'

export const routes = {}

routes.root = rootRouter
routes.groups = groupsRouter
