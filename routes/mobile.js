const env = require('../mod/env');

const template = require('backtick-template');

const fetch = require('node-fetch');

module.exports = { route, view };

function route(fastify) {

  fastify.route({
    method: 'GET',
    url: '/mobile',
    preValidation: fastify.auth([
      (req, res, next) => fastify.authToken(req, res, next, {
        public: true
      })
    ]),
    handler: view
  });

};

async function view(req, res, token = { access: 'public' }) {

  let tmpl;

  if (process.env.MOBILE_TEMPLATE && process.env.MOBILE_TEMPLATE.toLowerCase().includes('api.github')) {

    const response = await fetch(
      process.env.MOBILE_TEMPLATE,
      { headers: new fetch.Headers({ Authorization: `Basic ${Buffer.from(process.env.KEY_GITHUB).toString('base64')}` }) });

    const b64 = await response.json();
    const buff = await Buffer.from(b64.content, 'base64');
    tmpl = await buff.toString('utf8');

  } else {

    const response = await fetch(process.env.MOBILE_TEMPLATE || `${req.headers.host.includes('localhost') && 'http' || 'https'}://${req.headers.host}${process.env.DIR || ''}/views/desktop.html`);
    tmpl = await response.text();

  }

  const html = template(tmpl, {
    dir: process.env.DIR || '',
    token: req.query.token || token.signed || '""',
  })

  //Build the template with jsrender and send to client.
  res.type('text/html').send(html);

};