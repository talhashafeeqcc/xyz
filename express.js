const express = require('express')

const bodyParser = require('body-parser')

const app = express()

app.use(express.static('public'))

// app.use(bodyParser.urlencoded({extended: true}))

app.get('/', (req, res) => require('./api/root')(req, res))

app.post('/', bodyParser.urlencoded({extended: true}), (req, res) => require('./api/root')(req, res))

app.get('/api/package', (req, res) => require('./api/package')(req, res))

app.get('/api/workspace/get', (req, res) => require('./api/workspace/get')(req, res))

app.get('/api/layer/mvt', (req, res) => require('./api/layer/mvt')(req, res))

app.get('/api/user/admin', (req, res) => require('./api/user/admin')(req, res))

app.post('/api/user/admin', (req, res) => require('./api/user/admin')(req, res))

app.get('/api/workspace/checklayer', (req, res) => require('./api/workspace/checkLayer')(req, res))

app.post('/api/workspace/checklayer', bodyParser.urlencoded({extended: true}), (req, res) => require('./api/workspace/checkLayer')(req, res))

app.listen(process.env.PORT || 3000)
