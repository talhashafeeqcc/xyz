const requestBearer = require('../mod/requestBearer')

const queries = require('../mod/queries')

const dbs = require('../mod/pg/dbs')()

const template = require('backtick-template')

const fetch = require('node-fetch')

const sql_filter = require('../mod/pg/sql_filter')

module.exports = (req, res) => requestBearer(req, res, [ handler ], {
  public: true
})

async function handler(req, res) {

  const response = await fetch(
    'https://api.github.com/repos/GEOLYTIX/xyz_resources/contents/dev/queries/_population_summary',
    { headers: new fetch.Headers({ Authorization: `token ${process.env.KEY_GITHUB}` }) })

  const b64 = await response.json()
  const buff = await Buffer.from(b64.content, 'base64')
  const file = await buff.toString('utf8')

  queries['_population_summary'] = params => template(file, params)



  const q = queries[req.query.template](req.query)

  var rows = await dbs[req.query.dbs](q)

  if (rows instanceof Error) return res.status(500).send('Failed to query PostGIS table.')

  // return 204 if no record was returned from database.
  if (rows.length === 0) return res.status(202).send('No rows returned from table.')

  // Send the infoj object with values back to the client.
  res.send(rows)

}