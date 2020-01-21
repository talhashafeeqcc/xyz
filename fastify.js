// Catch unhandled errors on the process.
process.on('unhandledRejection', err => {
  console.error({err})
  if(err === 666) {
    console.log("Please check the ACL!")
    process.exit();
  }
});

process.on('uncaughtException', err => {
  console.error({err})
});

// Function to check whether a required module is available.
const req_res = m => {
  try {
    require.resolve(m);
    return require(m);

  } catch (e) {

    console.log('Cannot resolve ' + m);
    return false;
  }
};

// Load environment from dotenv if available.
const dotenv = req_res('dotenv');

dotenv && dotenv.config();

// Initiate environment module.
const env = require('./mod/env');


// Set fastify
const fastify = require('fastify')({
  trustProxy: true,
  logger: {
    level: process.env.LOG_LEVEL || 'error',
    prettifier: require('pino-pretty'),
    prettyPrint: {
      errorProps: 'hint, detail',
      levelFirst: true,
      crlf: true
    }
  }
});

// Register fastify modules and routes.
fastify
  .register(require('fastify-helmet'), {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: process.env.CSP_defaultSrc && process.env.CSP_defaultSrc.split(',') || ['\'self\''],
        baseURI: process.env.CSP_baseURI && process.env.CSP_baseURI.split(',') || ['\'self\''],
        objectSrc: process.env.CSP_objectSrc && process.env.CSP_objectSrc.split(',') || ['\'self\''],
        workerSrc: process.env.CSP_workerSrc && process.env.CSP_workerSrc.split(',') || ['\'self\'', 'blob:'],
        frameSrc: process.env.CSP_frameSrc && process.env.CSP_frameSrc.split(',') || ['\'self\'', 'www.google.com', 'www.gstatic.com'],
        formAction: process.env.CSP_formAction && process.env.CSP_formAction.split(',') || ['\'self\''],
        styleSrc: process.env.CSP_styleSrc && process.env.CSP_styleSrc.split(',') || ['\'self\'', '\'unsafe-inline\'', 'fonts.googleapis.com', 'cdn.jsdelivr.net'],
        fontSrc: process.env.CSP_fontSrc && process.env.CSP_fontSrc.split(',') || ['\'self\'', 'fonts.gstatic.com', 'cdn.jsdelivr.net'],
        scriptSrc: process.env.CSP_scriptSrc && process.env.CSP_scriptSrc.split(',') || ['\'self\'', '\'unsafe-inline\'', 'www.google.com', 'www.gstatic.com', 'cdn.jsdelivr.net', 'blob:'],
        imgSrc: process.env.CSP_imgSrc && process.env.CSP_imgSrc.split(',') || ['\'self\'', 'api.ordnancesurvey.co.uk', '*.tile.openstreetmap.org', 'api.mapbox.com', 'res.cloudinary.com', '*.global.ssl.fastly.net', 'cdn.jsdelivr.net', 'data:']
      },
      setAllHeaders: true
    },
    // Must be set to false to allow iframe embeds.
    frameguard: false,
    noCache: true
  })
  .register(require('fastify-cors'), {
    origin: true
  })
  .register(require('fastify-formbody'))
  .register(require('fastify-static'), {
    root: require('path').resolve(__dirname) + '/public',
    prefix: process.env.DIR || ''
  })
  .addContentTypeParser('*', (req, done) => done())
  .register((fastify, opts, next) => {
    routes(fastify);
    next();
  }, { prefix: process.env.DIR || '' });


fastify.listen(process.env.PORT || 3000, '0.0.0.0', err => {
  if (err) {
    Object.keys(err).forEach(key => !err[key] && delete err[key]);
    console.error(err);
    process.exit(1);
  }

  fastify.swagger();

  console.log('Fastify listening for requests.');
});


function routes(fastify){

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

}