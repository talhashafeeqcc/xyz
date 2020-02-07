const requestBearer = require('../../mod/requestBearer')

const layer = require('../../mod/layer')

const dbs = require('../../mod/pg/dbs')()

const sql_filter = require('../../mod/pg/sql_filter')

module.exports = (req, res) => requestBearer(req, res, [ layer, handler ], {
  public: true
})

async function handler(req, res) {

  const layer = req.params.layer

  const roles = layer.roles && req.params.token.roles && req.params.token.roles.filter(
    role => layer.roles[role]).map(
      role => layer.roles[role]) || []

  const filter = await sql_filter(Object.assign(
    {},
    req.query.filter && JSON.parse(req.query.filter) || {},
    roles.length && Object.assign(...roles) || {}))
    
  // Query the estimated extent for the layer geometry field from layer table.
  var rows = await dbs[layer.dbs](`
    SELECT count(1)
    FROM ${req.query.table}
    WHERE true ${filter};`)

  if (rows instanceof Error) return res.status(500).send('Failed to query PostGIS table.')

  res.status(200).send(rows[0].count)

}