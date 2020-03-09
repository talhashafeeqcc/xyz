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

app.get(`${process.env.DIR||''}/view/:template`, (req, res) => require('./api/view')(req, res))

app.post(`${process.env.DIR||''}/view/:template`, bodyParser.urlencoded({extended: true}), (req, res) => require('./api/view')(req, res))

app.get(`${process.env.DIR||''}/api/provider/:provider`, (req, res) => require('./api/provider')(req, res))

app.post(`${process.env.DIR||''}/api/provider/:provider`, bodyParser.json(), (req, res) => require('./api/provider')(req, res))

app.get(`${process.env.DIR||''}/api/query`, (req, res) => require('./api/query')(req, res))

app.get(`${process.env.DIR||''}/api/workspace/get/:key`, (req, res) => require('./api/workspace/get')(req, res))

app.post(`${process.env.DIR||''}/api/workspace/set`, bodyParser.json({limit: '5mb'}), (req, res) => require('./api/workspace/set')(req, res))

app.get(`${process.env.DIR||''}/api/layer/mvt/:z/:x/:y`, (req, res) => require('./api/layer/mvt')(req, res))

app.get(`${process.env.DIR||''}/api/layer/grid`, (req, res) => require('./api/layer/grid')(req, res))

app.get(`${process.env.DIR||''}/api/layer/cluster`, (req, res) => require('./api/layer/cluster')(req, res))

app.get(`${process.env.DIR||''}/api/layer/geojson`, (req, res) => require('./api/layer/geojson')(req, res))

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

app.get(`${process.env.DIR||''}/api/location/select/id`, (req, res) => require('./api/location/select/id')(req, res))

app.get(`${process.env.DIR||''}/api/location/select/aggregate`, (req, res) => require('./api/location/select/aggregate')(req, res))

app.post(`${process.env.DIR||''}/api/location/edit/update`, bodyParser.json(), (req, res) => require('./api/location/edit/update')(req, res))

app.get(`${process.env.DIR||''}/api/location/edit/delete`, (req, res) => require('./api/location/edit/delete')(req, res))

app.get(`${process.env.DIR||''}/api/location/edit/setnull`, (req, res) => require('./api/location/edit/setnull')(req, res))

app.post(`${process.env.DIR||''}/api/location/edit/isoline_save`, bodyParser.json(), (req, res) => require('./api/location/edit/isoline_save')(req, res))

app.post(`${process.env.DIR||''}/api/location/edit/draw`, bodyParser.json(), (req, res) => require('./api/location/edit/draw')(req, res))

app.post(`${process.env.DIR||''}/api/location/edit/geom_update`, bodyParser.json(), (req, res) => require('./api/location/edit/geom_update')(req, res))

app.get(`${process.env.DIR||''}/api/gazetteer`, (req, res) => require('./api/gazetteer')(req, res))

app.listen(process.env.PORT || 3000)