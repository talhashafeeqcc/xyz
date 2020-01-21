const auth = require('../mod/auth/handler');

const _workspace = require('../mod/workspace/get')();

const Md = require('mobile-detect');

const fetch = require('node-fetch');

const template = require('backtick-template');

module.exports = (req, res) => auth(req, res, handler, {
  public: true,
  login: true
});

async function handler(req, res, token = { access: 'public' }){

  const workspace = await _workspace;

  const md = new Md(req.headers['user-agent']);

  const tmpl = (md.mobile() === null || md.tablet() !== null) ?
    await fetch(`${req.headers.host.includes('localhost') && 'http' || 'https'}://${req.headers.host}${process.env.DIR || ''}/views/desktop.html`) :
    await fetch(`${req.headers.host.includes('localhost') && 'http' || 'https'}://${req.headers.host}${process.env.DIR || ''}/views/mobile.html`);

  const html = template(await tmpl.text(), {
    dir: process.env.DIR || '',
    title: workspace.title || 'GEOLYTIX | XYZ',
    token: req.query.token || token.signed || '""',
    log: process.env.LOG_LEVEL || '""',
    login: (process.env.PRIVATE || process.env.PUBLIC) && 'true' || '""',
  });

  res.send(html);

}