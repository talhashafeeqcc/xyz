const auth = require('../mod/auth/handler')

const fetch = require('node-fetch')

module.exports = (req, res) => auth(req, res, handler, {
  public: true
})

async function handler(req, res, token = { access: 'public' }) {

  console.log(req.query.uri)

  const response = await fetch(
    req.query.uri,
    { headers: new fetch.Headers({ Authorization: `Basic ${Buffer.from(process.env.KEY_GITHUB).toString('base64')}` }) })

  const b64 = await response.json()
  const buff = await Buffer.from(b64.content, 'base64')
  const file = await buff.toString('utf8')
  return res.send(file)

}