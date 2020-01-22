const express = require('express')

const bodyParser = require('body-parser')

const app = express()

app.use(process.env.DIR||'', express.static('public'))

app.get(`${process.env.DIR||''}/`, (req, res) => require('./api/root')(req, res))

app.post(`${process.env.DIR||''}/`, bodyParser.urlencoded({extended: true}), (req, res) => require('./api/root')(req, res))

app.get(`${process.env.DIR||''}/api/package`, (req, res) => require('./api/package')(req, res))

app.get(`${process.env.DIR||''}/api/workspace/get`, (req, res) => require('./api/workspace/get')(req, res))

app.get(`${process.env.DIR||''}/api/layer/mvt`, (req, res) => require('./api/layer/mvt')(req, res))

app.get(`${process.env.DIR||''}/api/user/admin`, (req, res) => require('./api/user/admin')(req, res))

app.post(`${process.env.DIR||''}/api/user/admin`, bodyParser.urlencoded({extended: true}), (req, res) => require('./api/user/admin')(req, res))

app.get(`${process.env.DIR||''}/api/user/list`, (req, res) => require('./api/user/list')(req, res))

app.get(`${process.env.DIR||''}/api/user/log`, (req, res) => require('./api/user/log')(req, res))

app.get(`${process.env.DIR||''}/api/user/update`, (req, res) => require('./api/user/update')(req, res))

app.get(`${process.env.DIR||''}/api/user/delete`, (req, res) => require('./api/user/delete')(req, res))

app.get(`${process.env.DIR||''}/api/workspace/checklayer`, (req, res) => require('./api/workspace/checkLayer')(req, res))

app.post(`${process.env.DIR||''}/api/workspace/checklayer`, bodyParser.urlencoded({extended: true}), (req, res) => require('./api/workspace/checkLayer')(req, res))

app.listen(process.env.PORT || 3000)