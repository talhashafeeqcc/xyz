// const finalhandler = require('finalhandler');
// const http = require('http');
// const Router = require('router');

// const router = Router()

// router.get('/', require('./api/root'))

// const server = http.createServer(function(req, res) {
//   router(req, res, finalhandler(req, res));
// })


const micro = require('micro');
const Router = require('micro-http-router');
const url = require('url');

const router = new Router();

const root = require('./api/root');

router.get('/', (req, res) => {
  root(req, res)
});

const server = micro((req, res) => {

  const { query } = url.parse(req.url, true);

  req.query = query;
  
  router.handle(req, res);

});

server.listen(3000);