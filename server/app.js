
import express from 'express'
import bodyParser from 'body-parser'

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.status(200).json({
    status: 'Server Run successfully'
  })
})

// Run Server
app.listen(8080, () => {
  console.log('Server is running on port 8080!')
})
