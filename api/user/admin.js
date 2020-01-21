const auth = require('../../mod/auth/handler');

const fetch = require('node-fetch');

const template = require('backtick-template');

module.exports = (req, res) => auth(req, res, handler, {
  admin_user: true,
  login: true
});

async function handler(req, res, token){

  const tmpl = await fetch(`${req.headers.host.includes('localhost') && 'http' || 'https'}://${req.headers.host}${process.env.DIR || ''}/views/user.html`);

  const html = template(await tmpl.text(), {
    dir: process.env.DIR || '',
    token: token.signed
  });

  res.send(html);

}