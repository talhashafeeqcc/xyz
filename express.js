const dotenv = require('dotenv');
dotenv.config();

const express = require('express')

const bodyParser = require('body-parser')

const app = express()


app.use(process.env.DIR||'', express.static('public'))


const proxy = require('express-http-proxy');

app.use(`${process.env.DIR || ''}/api/proxy`, proxy(
    req => req.query.host,
    {
        https: true,
        proxyReqPathResolver: req => {

            //console.log(`${encodeURIComponent(req.query.uri)}&${process.env[`KEY_${req.query.provider.toUpperCase()}`]}`)
            return `${req.query.uri}&${process.env[`KEY_${req.query.provider.toUpperCase()}`]}`

        }
    }))

app.get(process.env.DIR||'', (req, res) => require('./api/root')(req, res))

app.post(process.env.DIR||'', bodyParser.urlencoded({extended: true}), (req, res) => require('./api/root')(req, res))

app.get(`${process.env.DIR||''}/view/:template?`, (req, res) => require('./api/view')(req, res))

app.post(`${process.env.DIR||''}/view/:template?`, bodyParser.urlencoded({extended: true}), (req, res) => require('./api/view')(req, res))

app.get(`${process.env.DIR||''}/api/provider/:provider?`, (req, res) => require('./api/provider')(req, res))

app.post(`${process.env.DIR||''}/api/provider/:provider?`, bodyParser.json(), (req, res) => require('./api/provider')(req, res))

app.get(`${process.env.DIR||''}/api/query/:template?`, (req, res) => require('./api/query')(req, res))

app.get(`${process.env.DIR||''}/api/gazetteer`, (req, res) => require('./api/gazetteer')(req, res))


app.get(`${process.env.DIR||''}/api/workspace/get/:key`, (req, res) => require('./api/workspace/get')(req, res))

app.post(`${process.env.DIR||''}/api/workspace/set`, bodyParser.json({limit: '5mb'}), (req, res) => require('./api/workspace/set')(req, res))


app.get(`${process.env.DIR||''}/api/layer/:format?/:z?/:x?/:y?`, (req, res) => require('./api/layer')(req, res))


app.get(`${process.env.DIR||''}/api/location/:method?`, (req, res) => require('./api/location')(req, res))


app.get(`${process.env.DIR||''}/api/user/key`, (req, res) => require('./api/user/key')(req, res))

app.post(`${process.env.DIR||''}/api/user/key`, bodyParser.urlencoded({extended: true}), (req, res) => require('./api/user/key')(req, res))

app.get(`${process.env.DIR||''}/api/user/token`, (req, res) => require('./api/user/token')(req, res))

app.post(`${process.env.DIR||''}/api/user/token`, bodyParser.urlencoded({extended: true}), (req, res) => require('./api/user/token')(req, res))

app.get(`${process.env.DIR||''}/api/user/register`, (req, res) => require('./api/user/register')(req, res))

app.post(`${process.env.DIR||''}/api/user/register`, bodyParser.urlencoded({extended: true}), (req, res) => require('./api/user/register')(req, res))

app.get(`${process.env.DIR||''}/api/user/verify`, (req, res) => require('./api/user/verify')(req, res))

app.get(`${process.env.DIR||''}/api/user/approve`, (req, res) => require('./api/user/approve')(req, res))

app.post(`${process.env.DIR||''}/api/user/approve`, bodyParser.urlencoded({extended: true}), (req, res) => require('./api/user/approve')(req, res))

app.get(`${process.env.DIR||''}/api/user/pgtable`, (req, res) => require('./api/user/pgtable')(req, res))

app.get(`${process.env.DIR||''}/api/user/update`, (req, res) => require('./api/user/update')(req, res))

app.get(`${process.env.DIR||''}/api/user/delete`, (req, res) => require('./api/user/delete')(req, res))


app.listen(process.env.PORT || 3000)