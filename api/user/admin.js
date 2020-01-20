const auth = require('../../mod/auth/handler');

const env = require('../../mod/env');

const fetch = require('node-fetch');

const template = require('backtick-template');

module.exports = (req, res) => auth(req, res, handler, {
  admin_user: true,
  login: true
});

async function handler(req, res, token){

  const tmpl = await fetch(`${req.headers.host.includes('localhost') && 'http' || 'https'}://${req.headers.host}${env.path}/views/user.html`);

  const html = template(await tmpl.text(), {
    dir: env.path,
    token: token.signed
  });

  res.type && res.type('text/html').send(html) || res.send(html);

}