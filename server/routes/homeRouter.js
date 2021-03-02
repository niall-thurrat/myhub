import express from 'express'
import homeContoller from '../controllers/home'

const homeRouter = express.Router()

homeRouter.get('/', homeContoller)

export default homeRouter
