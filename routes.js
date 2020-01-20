module.exports = fastify => {

  fastify.route({
    method: ['GET','POST'],
    url: '/', 
    handler: require('./api/root')
  });

  fastify.route({
    method: 'GET',
    url: '/api/package',
    handler: require('./api/package')
  });

  fastify.route({
    method: 'GET',
    url: '/api/workspace/get',
    handler: require('./api/workspace/get')
  });

  fastify.route({
    method: 'GET',
    url: '/api/layer/mvt',
    handler: require('./api/layer/mvt')
  });

  fastify.route({
    method: ['GET','POST'],
    url: '/api/user/admin',
    handler: require('./api/user/admin')
  });

};