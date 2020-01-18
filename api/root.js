const env = require('../mod/env');

const auth = require('../mod/auth');

const template = require('backtick-template');

const nanoid = require('nanoid');

const Md = require('mobile-detect');

const fetch = require('node-fetch');

module.exports = (req, res) => auth(req, res, handler, {
  public: true,
  login: true
});

async function handler(req, res, token = { access: 'public' }) {

  env.workspace = await env.workspace;

  const md = new Md(req.headers['user-agent']);

  const tmpl = (md.mobile() === null || md.tablet() !== null) ?
    await fetch(`${req.headers.host.includes('localhost') && 'http' || 'https'}://${req.headers.host}${env.path}/views/desktop.html`) :
    await fetch(`${req.headers.host.includes('localhost') && 'http' || 'https'}://${req.headers.host}${env.path}/views/mobile.html`);

  const html = template(await tmpl.text(), {
    dir: env.path,
    title: env.workspace.title || 'GEOLYTIX | XYZ',
    nanoid: nanoid(6),
    token: req.query.token || token.signed || '""',
    log: env.logs || '""',
    login: (env.acl_connection) && 'true' || '""',
    pgworkspace: (env.pg.workspace) && 'true' || '""',
  });

  res.type && res.type('text/html').send(html) || res.send(html);

}