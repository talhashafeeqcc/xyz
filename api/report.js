const requestBearer = require('../mod/requestBearer')

const fetch = require('node-fetch')

const template = require('backtick-template')

module.exports = (req, res) => requestBearer(req, res, [ handler ], {
  public: true,
  login: true
})

async function handler(req, res){

  let tmpl

  if (req.query.template.toLowerCase().includes('api.github')) {

    const response = await fetch(
      req.query.template,
      { headers: new fetch.Headers({ Authorization: `token ${Buffer.from(process.env.KEY_GITHUB).toString('base64')}` }) })

    const b64 = await response.json()
    const buff = await Buffer.from(b64.content, 'base64')
    tmpl = await buff.toString('utf8')

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