const bodyParser = require('body-parser')
const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

// Middlewares

app.use(cors())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))

// Database

const mongoInit = require('./database').initialize
const { User } = require('./database/Models')

// Routes

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.post('/api/users', async (req, res) => {
  const username = req.body.username

  if (!username) {
    res.status(400).send({ error: 'Somthing bad happend!'})
  }

  const user = new User({ username })
  user.save()

  res.status(201).send(user)
})

app.get('/api/users', async (req, res) => {
  const users = await User.find({})
  res.json(users)
})

const listener = app.listen(process.env.PORT || 3000, async () => {
  await mongoInit()
  console.log('Your app is listening on port ' + listener.address().port)
})
