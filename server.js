// Catch unhandled errors on the process.
process.on('unhandledRejection', err => console.error(err));

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

if (dotenv) dotenv.load();


// Global appRoot for absolute require paths.
global.__approot = require('path').resolve(__dirname);

// Initiate environment module.
const env = require(global.__approot + '/mod/env');

// Store provider keys.
Object.keys(process.env).forEach(key => {
  if (key.split('_')[0] === 'KEY') {
    env.keys[key.split('_')[1]] = process.env[key];
  }
});

// Create PostGIS dbs connection pools.
require(global.__approot + '/mod/pg/dbs')();

// Create PostgreSQL ACL connection pool.
require(global.__approot + '/mod/pg/acl')();

// Create PostgreSQL Workspace connection pool.
require(global.__approot + '/mod/pg/ws')();

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
        defaultSrc: ['\'self\'', '*.logrocket.io'],
        baseURI: ['\'self\''],
        objectSrc: ['\'self\''],
        workerSrc: ['\'self\'', 'blob:'],
        frameSrc: ['\'self\'', 'www.google.com', 'www.gstatic.com'],
        formAction: ['\'self\''],
        styleSrc: ['\'self\'', '\'unsafe-inline\'', 'fonts.googleapis.com'],
        fontSrc: ['\'self\'', 'fonts.gstatic.com'],
        scriptSrc: ['\'self\'', 'www.google.com', 'www.gstatic.com', '*.logrocket.io'],
        imgSrc: ['\'self\'', '*.tile.openstreetmap.org', 'api.mapbox.com', 'res.cloudinary.com', 'raw.githubusercontent.com', 'data:']
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
    root: global.__approot + '/public',
    prefix: env.path + '/'
  })
  .register(require('fastify-auth'))
  .decorate('login', require(global.__approot + '/routes/login')(fastify))
  .decorate('authToken', require(global.__approot + '/mod/authToken')(fastify))
  .decorate('evalParam', require(global.__approot + '/mod/evalParam')(fastify))
  .register(require('fastify-jwt'), {
    secret: env.secret
  })
  .register(require('fastify-swagger'), {
    routePrefix: env.path + '/swagger',
    exposeRoute: true,
  })
  .addContentTypeParser('*', (req, done) => done())
  .register((fastify, opts, next) => {
    require('./routes/_routes')(fastify);
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