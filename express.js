const dotenv = require('dotenv');
dotenv.config();

const express = require('express')

const bodyParser = require('body-parser')

const app = express()



// const router = express.Router({ strict: true })

// router.get(process.env.DIR||'/', (req, res) => require('./api/root')(req, res))

// router.use((req, res, next) => {
//     res.redirect(`${process.env.DIR||''}/view`);

//     next();
// });

// app.use('', router)



//app.enable('strict routing')

// app.set('strict routing', true)

app.get(process.env.DIR||'', (req, res) => require('./api/root')(req, res))

app.post(process.env.DIR||'', bodyParser.urlencoded({extended: true}), (req, res) => require('./api/root')(req, res))

app.use(process.env.DIR||'', express.static('public'))

app.get(`${process.env.DIR||''}/api/package`, (req, res) => require('./api/package')(req, res))

app.get(`${process.env.DIR||''}/api/workspace/get`, (req, res) => require('./api/workspace/get')(req, res))

const proxy = require('express-http-proxy');

app.use(`${process.env.DIR || ''}/api/proxy/request`, proxy(
    req => req.query.host,
    {
        https: true,
        proxyReqPathResolver: req => `${req.query.uri}${process.env[`KEY_${req.query.provider.toUpperCase()}`]}`
    }))

app.get(`${process.env.DIR||''}/api/layer/mvt`, (req, res) => require('./api/layer/mvt')(req, res))

app.get(`${process.env.DIR||''}/api/layer/label`, (req, res) => require('./api/layer/label')(req, res))

app.get(`${process.env.DIR||''}/api/layer/count`, (req, res) => require('./api/layer/count')(req, res))

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

app.listen(process.env.PORT || 3000)