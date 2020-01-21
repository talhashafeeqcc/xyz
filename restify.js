var restify = require('restify');

var server = restify.createServer();

server.get('/', require('./api/root'))

server.post('/', require('./api/root'))

server.get('/api/package', require('./api/package'))

server.get('/api/workspace/get', require('./api/workspace/get'))

server.get('/api/layer/mvt', require('./api/layer/mvt'))

server.get('/api/user/admin', require('./api/user/admin'))

server.post('/api/user/admin', require('./api/user/admin'))

server.get('/*', restify.plugins.serveStatic({
    directory: './public'
}));

server.listen(3000);