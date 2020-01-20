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
    level: env.logs || 'error',
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
    prefix: env.path
  })
  .decorate('evalParam', require('./mod/eval/_param'))
  .register(require('fastify-swagger'), {
    routePrefix: env.path + '/swagger',
    exposeRoute: true,
  })
  .addContentTypeParser('*', (req, done) => done())
  .register((fastify, opts, next) => {
    require('./routes')(fastify);
    next();
  }, { prefix: env.path });


fastify.listen(env.port, '0.0.0.0', err => {
  if (err) {
    Object.keys(err).forEach(key => !err[key] && delete err[key]);
    console.error(err);
    process.exit(1);
  }

  fastify.swagger();

  console.log('Fastify listening for requests.');
});