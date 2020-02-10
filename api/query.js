const requestBearer = require('../mod/requestBearer')

const getQueries = require('../mod/queries/_queries')

const queries = getQueries()

const dbs = require('../mod/pg/dbs')()

const sql_filter = require('../mod/pg/sql_filter')

module.exports = (req, res) => requestBearer(req, res, [ handler ], {
  public: true
})

async function handler(req, res) {

  if (req.query.clear_cache) {
    Object.assign(queries, getQueries())
    return res.end()
  }

  Object.assign(queries, await queries)

  const q = queries[req.query.template].template(req.query)

  const rows = await dbs[queries[req.query.template].dbs || req.query.dbs](q)

  if (rows instanceof Error) return res.status(500).send('Failed to query PostGIS table.')

  // return 204 if no record was returned from database.
  if (rows.length === 0) return res.status(202).send('No rows returned from table.')

  // Send the infoj object with values back to the client.
  res.send(rows)

}