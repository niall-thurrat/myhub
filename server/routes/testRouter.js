import express from 'express'
import testContoller from '../controllers/test'

const testRouter = express.Router()

testRouter.get('/', testContoller)

export default testRouter
