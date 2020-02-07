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

  // Get table entry from layer or min table in from tables array.
  const table = layer.table || Object.values(layer.tables)[0] || Object.values(layer.tables)[1];

  var geom = `Box2D(ST_Transform(ST_SetSRID(ST_Extent(${layer.geom}), ${layer.srid}), ${req.query.srid || 3857}))`;

  // Query the estimated extent for the layer geometry field from layer table.
  var rows = await dbs[layer.dbs](`
  SELECT ${geom}
  FROM ${table}
  WHERE true ${filter};`)

  if (rows instanceof Error) return res.status(500).send('Failed to query PostGIS table.')

  // Get bounds from first row value.
  const bounds = Object.values(Object.values(rows)[0])[0]

  // Return 204 if bounds couldn't be formed.
  if (!bounds) return res.status(204).send('No bounds.')

  // Regex format bounds as comma separated string and return to client.
  res.send(/\((.*?)\)/.exec(bounds)[1].replace(/ /g, ','))

}