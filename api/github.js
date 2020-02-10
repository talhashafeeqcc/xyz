const requestBearer = require('../mod/requestBearer')

const fetch = require('node-fetch')

module.exports = (req, res) => requestBearer(req, res, [ handler ], {
  public: true
})

async function handler(req, res) {

  const response = await fetch(
    req.query.uri,
    { headers: new fetch.Headers({ Authorization: `token ${process.env.KEY_GITHUB}` }) })

  const b64 = await response.json()
  const buff = await Buffer.from(b64.content, 'base64')
  const file = await buff.toString('utf8')
  return res.send(file)

}