const requestBearer = require('../../mod/requestBearer');

const fetch = require('node-fetch');

const template = require('backtick-template');

module.exports = (req, res) => requestBearer(req, res, [ handler ], {
  admin_user: true,
  login: true
});

async function handler(req, res){

  const tmpl = await fetch(`${req.headers.host.includes('localhost') && 'http' || 'https'}://${req.headers.host}${process.env.DIR || ''}/views/user.html`);

  const html = template(await tmpl.text(), {
    dir: process.env.DIR || '',
    token: req.params.token.signed
  });

  res.send(html);

}