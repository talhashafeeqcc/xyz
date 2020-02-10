const requestBearer = require('../mod/requestBearer')

const fetch = require('node-fetch')

const template = require('backtick-template')

const github = require('../mod/github/get')

module.exports = (req, res) => requestBearer(req, res, [ handler ], {
  public: true,
  login: true
})

async function handler(req, res){

  let tmpl

  if (req.query.template.toLowerCase().includes('api.github')) {

    tmpl = await github({uri: req.query.template});

  } else {

    const response = await fetch(`${req.headers.host.includes('localhost') && 'http' || 'https'}://${req.headers.host}${process.env.DIR || ''}${req.query.template}`)
    if (response.status !== 200) return res.type('text/plain').send('Failed to retrieve report template')
    tmpl = await response.text()

  }

  const html = template(tmpl, {
    dir: process.env.DIR || '',
    host: `${req.headers.host.includes('localhost') && 'http' || 'https'}://${req.headers.host}${process.env.DIR || '' || ''}`,
    token: req.query.token || req.params.token.signed || '""'
  })

  //Build the template with jsrender and send to client.
  res.send(html)

}