const auth = require('../mod/auth/handler')

const fetch = require('node-fetch')

module.exports = (req, res) => auth(req, res, handler, {
  admin_workspace: true,
  login: true
});

async function handler(req, res){

  fetch(`${req.headers.host.includes('localhost') && 'http' || 'https'}://${req.headers.host}${process.env.DIR || ''}/api/workspace/get`,
  { headers: new fetch.Headers({ 'Cache-Control': 'no-cache' }) })

  res.send('cache cleared');

}