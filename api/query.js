const requestBearer = require('../mod/requestBearer')

const getQueries = require('../mod/queries/_queries')

const queries = getQueries()

const getWorkspace = require('../mod/workspace/get')

const workspace = getWorkspace()

const dbs = require('../mod/pg/dbs')()

const sql_filter = require('../mod/pg/sql_filter')

module.exports = (req, res) => requestBearer(req, res, [ handler ], {
  public: true
})

async function handler(req, res) {

  if (req.query.clear_cache) {
    Object.assign(queries, getQueries())
    Object.assign(workspace, getWorkspace())
    return res.end()
  }

  Object.assign(queries, await queries)
  Object.assign(workspace, await workspace)

  const query = queries[req.query.template];

  const token = req.params.token || {};

  const params = req.query || {};

  if (query.admin_workspace && !token.admin_workspace) return res.status(401).send('Insuficcient priviliges.')

  if (req.query.locale && req.query.layer) {

    const locale = workspace.locales[req.query.locale]

    const layer = locale.layers[req.query.layer]

    const roles = layer.roles && req.params.token.roles && req.params.token.roles.filter(
      role => layer.roles[role]).map(
        role => layer.roles[role]) || []

    const filter = await sql_filter(Object.assign(
      {},
      req.query.filter && JSON.parse(req.query.filter) || {},
      roles.length && Object.assign(...roles) || {}))

    Object.assign(params, {layer: layer, filter: filter})
  }

  const q = query.template(params)

  const rows = await dbs[query.dbs || params.dbs || params.layer.dbs](q)

  if (rows instanceof Error) return res.status(500).send('Failed to query PostGIS table.')

  // return 204 if no record was returned from database.
  if (!rows || !rows.length) return res.status(202).send('No rows returned from table.')

  // Send the infoj object with values back to the client.
  res.send(rows)

}