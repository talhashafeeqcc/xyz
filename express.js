const dotenv = require('dotenv');
dotenv.config();

const express = require('express')

const bodyParser = require('body-parser')

const app = express()


app.get(process.env.DIR||'', (req, res) => require('./api/root')(req, res))

app.post(process.env.DIR||'', bodyParser.urlencoded({extended: true}), (req, res) => require('./api/root')(req, res))

app.get(`${process.env.DIR||''}/desktop`, (req, res) => require('./api/desktop')(req, res))

app.post(`${process.env.DIR||''}/desktop`, bodyParser.urlencoded({extended: true}), (req, res) => require('./api/desktop')(req, res))

app.get(`${process.env.DIR||''}/mobile`, (req, res) => require('./api/mobile')(req, res))

app.post(`${process.env.DIR||''}/mobile`, bodyParser.urlencoded({extended: true}), (req, res) => require('./api/mobile')(req, res))

app.use(process.env.DIR||'', express.static('public'))

app.get(`${process.env.DIR||''}/api/package`, (req, res) => require('./api/package')(req, res))

app.get(`${process.env.DIR||''}/api/workspace/get`, (req, res) => require('./api/workspace/get')(req, res))

const proxy = require('express-http-proxy');

app.use(`${process.env.DIR || ''}/api/proxy/request`, proxy(
    req => req.query.host,
    {
        https: true,
        proxyReqPathResolver: req => {

            //console.log(`${encodeURIComponent(req.query.uri)}&${process.env[`KEY_${req.query.provider.toUpperCase()}`]}`)
            return `${req.query.uri}&${process.env[`KEY_${req.query.provider.toUpperCase()}`]}`

        }
    }))

app.get(`${process.env.DIR||''}/api/layer/mvt`, (req, res) => require('./api/layer/mvt')(req, res))

app.get(`${process.env.DIR||''}/api/layer/grid`, (req, res) => require('./api/layer/grid')(req, res))

app.get(`${process.env.DIR||''}/api/layer/label`, (req, res) => require('./api/layer/label')(req, res))

app.get(`${process.env.DIR||''}/api/layer/count`, (req, res) => require('./api/layer/count')(req, res))

app.get(`${process.env.DIR||''}/api/layer/cluster`, (req, res) => require('./api/layer/cluster')(req, res))

app.get(`${process.env.DIR||''}/api/layer/geojson`, (req, res) => require('./api/layer/geojson')(req, res))

app.get(`${process.env.DIR||''}/api/layer/table`, (req, res) => require('./api/layer/table')(req, res))

app.get(`${process.env.DIR||''}/api/layer/extent`, (req, res) => require('./api/layer/extent')(req, res))

app.get(`${process.env.DIR||''}/api/layer/chart`, (req, res) => require('./api/layer/chart')(req, res))

app.get(`${process.env.DIR||''}/api/user/admin`, (req, res) => require('./api/user/admin')(req, res))

app.post(`${process.env.DIR||''}/api/user/admin`, bodyParser.urlencoded({extended: true}), (req, res) => require('./api/user/admin')(req, res))

app.get(`${process.env.DIR||''}/api/user/key`, (req, res) => require('./api/user/key')(req, res))

app.post(`${process.env.DIR||''}/api/user/key`, bodyParser.urlencoded({extended: true}), (req, res) => require('./api/user/key')(req, res))

app.get(`${process.env.DIR||''}/api/user/token`, (req, res) => require('./api/user/token')(req, res))

app.post(`${process.env.DIR||''}/api/user/token`, bodyParser.urlencoded({extended: true}), (req, res) => require('./api/user/token')(req, res))

app.get(`${process.env.DIR||''}/api/user/register`, (req, res) => require('./api/user/register')(req, res))

app.post(`${process.env.DIR||''}/api/user/register`, bodyParser.urlencoded({extended: true}), (req, res) => require('./api/user/register')(req, res))

app.get(`${process.env.DIR||''}/api/user/verify`, (req, res) => require('./api/user/verify')(req, res))

app.get(`${process.env.DIR||''}/api/user/approve`, (req, res) => require('./api/user/approve')(req, res))

app.post(`${process.env.DIR||''}/api/user/approve`, bodyParser.urlencoded({extended: true}), (req, res) => require('./api/user/approve')(req, res))

app.get(`${process.env.DIR||''}/api/user/list`, (req, res) => require('./api/user/list')(req, res))

app.get(`${process.env.DIR||''}/api/user/acl`, (req, res) => require('./api/user/acl')(req, res))

app.get(`${process.env.DIR||''}/api/user/log`, (req, res) => require('./api/user/log')(req, res))

app.get(`${process.env.DIR||''}/api/user/update`, (req, res) => require('./api/user/update')(req, res))

app.get(`${process.env.DIR||''}/api/user/delete`, (req, res) => require('./api/user/delete')(req, res))

app.get(`${process.env.DIR||''}/api/workspace/checklayer`, (req, res) => require('./api/workspace/checkLayer')(req, res))

app.post(`${process.env.DIR||''}/api/workspace/checklayer`, bodyParser.urlencoded({extended: true}), (req, res) => require('./api/workspace/checkLayer')(req, res))

app.get(`${process.env.DIR||''}/api/workspace/admin`, (req, res) => require('./api/workspace/admin')(req, res))

app.post(`${process.env.DIR||''}/api/workspace/admin`, bodyParser.urlencoded({extended: true}), (req, res) => require('./api/workspace/admin')(req, res))

app.get(`${process.env.DIR||''}/api/location/select/id`, (req, res) => require('./api/location/select/id')(req, res))

app.get(`${process.env.DIR||''}/api/location/select/cluster`, (req, res) => require('./api/location/select/cluster')(req, res))

app.get(`${process.env.DIR||''}/api/location/select/nnearest`, (req, res) => require('./api/location/select/nnearest')(req, res))

app.get(`${process.env.DIR||''}/api/location/select/interesect`, (req, res) => require('./api/location/select/intersect')(req, res))

app.get(`${process.env.DIR||''}/api/location/select/contains`, (req, res) => require('./api/location/select/contains')(req, res))

app.get(`${process.env.DIR||''}/api/location/field`, (req, res) => require('./api/location/field')(req, res))

app.get(`${process.env.DIR||''}/api/location/range`, (req, res) => require('./api/location/range')(req, res))

app.get(`${process.env.DIR||''}/api/location/select/aggregate`, (req, res) => require('./api/location/select/aggregate')(req, res))

app.get(`${process.env.DIR||''}/api/location/table`, (req, res) => require('./api/location/table')(req, res))

app.get(`${process.env.DIR||''}/api/location/list`, (req, res) => require('./api/location/list')(req, res))

app.post(`${process.env.DIR||''}/api/location/edit/update`, bodyParser.json(), (req, res) => require('./api/location/edit/update')(req, res))

app.get(`${process.env.DIR||''}/api/location/edit/delete`, (req, res) => require('./api/location/edit/delete')(req, res))

app.get(`${process.env.DIR||''}/api/location/edit/setnull`, (req, res) => require('./api/location/edit/setnull')(req, res))

app.get(`${process.env.DIR||''}/api/location/edit/isoline/here`, (req, res) => require('./api/location/edit/isoline/here')(req, res))

app.get(`${process.env.DIR||''}/api/location/edit/isoline/mapbox`, (req, res) => require('./api/location/edit/isoline/mapbox')(req, res))

app.post(`${process.env.DIR||''}/api/location/edit/isoline/save`, bodyParser.json(), (req, res) => require('./api/location/edit/isoline/save')(req, res))

app.post(`${process.env.DIR||''}/api/location/edit/draw`, bodyParser.json(), (req, res) => require('./api/location/edit/draw')(req, res))

app.post(`${process.env.DIR||''}/api/location/edit/geom_update`, bodyParser.json(), (req, res) => require('./api/location/edit/geom_update')(req, res))

app.get(`${process.env.DIR||''}/api/gazetteer/autocomplete`, (req, res) => require('./api/gazetteer/autocomplete')(req, res))

app.get(`${process.env.DIR||''}/api/gazetteer/googleplaces`, (req, res) => require('./api/gazetteer/googleplaces')(req, res))

app.listen(process.env.PORT || 3000)