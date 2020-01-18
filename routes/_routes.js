module.exports = fastify => {

  fastify.route({
    method: 'GET',
    url: '/', 
    handler: require('../api/root')
  });

  fastify.route({
    method: 'GET',
    url: '/api/workspace/get',
    handler: require('../api/workspace/get')
  });

  fastify.route({
    method: 'GET',
    url: '/api/layer/mvt',
    handler: require('../api/layer/mvt')
  });

  // require('./desktop').route(fastify);

  // require('./mobile').route(fastify);

  // require('./version')(fastify);  

  // fastify.login.route(fastify);
  
  // require('./register')(fastify);

  // require('./token').route(fastify);

  // require('./proxy_request')(fastify);

  // require('./proxy_cdn')(fastify);

  // require('./proxy_pg')(fastify);

  // require('./report').route(fastify);

  // require('./api/_api')(fastify);

  // require('./user/_user')(fastify);

  // require('./workspace/_workspace')(fastify);

};