const env = require('../mod/env');

const fetch = require('node-fetch');

const template = require('backtick-template');

module.exports = view;

async function view(req, res) {

  // Fail messaged to be displayed for msg query parameter in redirect.
  const msgs = {
    fail: 'Login has failed.<br />'
      + 'This may be due to insufficient priviliges or the account being locked.<br />'
      + 'Please check your inbox for an email with additional details.',
    validation: 'Please check your inbox for an email with additional details.',
    reset: 'The password has been reset for this account.',
    approval: 'This account has been verified but requires administrator approval.',
    badconfig: 'There seems to be a problem with the ACL configuration.'
  };

  const tmpl = await fetch(`${req.headers.host.includes('localhost') && 'http' || 'https'}://${req.headers.host}${env.path}/views/login.html`)
  
  const html = template(await tmpl.text(), {
    dir: env.path,
    action: req.url || req.req.url,
    msg: req.query.msg ? msgs[req.query.msg] : ' ',
    captcha: env.captcha && env.captcha[0] || '',
  });

  // Send login view to client.
  res.type && res.type('text/html').send(html) || res.send(html);
}