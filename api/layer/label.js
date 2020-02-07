const requestBearer = require('../../mod/requestBearer')

const layer = require('../../mod/layer')

const dbs = require('../../mod/pg/dbs')()

const sql_filter = require('../../mod/pg/sql_filter')

module.exports = (req, res) => requestBearer(req, res, [ layer, handler ], {
  public: true
})

async function handler(req, res) {

  const layer = req.params.layer

  let
    table = req.query.table,
    label = req.query.label,
    west = parseFloat(req.query.west),
    south = parseFloat(req.query.south),
    east = parseFloat(req.query.east),
    north = parseFloat(req.query.north)

  // Combine filter with envelope
  const viewport = `
  AND ST_DWithin(
    ST_MakeEnvelope(${west}, ${south}, ${east}, ${north}, ${parseInt(layer.srid)}),
    ${layer.geom}, 0.00001)
    ${req.query.filter && await sql_filter(JSON.parse(req.query.filter)) || ''}`

  const roles = layer.roles && req.params.token.roles && req.params.token.roles.filter(
    role => layer.roles[role]).map(
      role => layer.roles[role]) || []

  const filter = await sql_filter(Object.assign(
    {},
    req.query.filter && JSON.parse(req.query.filter) || {},
    roles.length && Object.assign(...roles) || {}))

  var q = `
  SELECT
    ${label} AS label,
    ST_X(ST_PointOnSurface(${layer.geom})) AS x,
    ST_Y(ST_PointOnSurface(${layer.geom})) AS y
  FROM ${table}
  WHERE true
    ${viewport}
    ${filter}`


  var rows = await dbs[layer.dbs](q)

  if (rows instanceof Error) return res.status(500).send('Failed to query PostGIS table.')

  return res.send(rows.map(row => ({
    geometry: {
      x: row.x,
      y: row.y,
    },
    properties: {
      label: row.label
    }
  })))

}