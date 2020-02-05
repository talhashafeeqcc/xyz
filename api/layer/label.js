const auth = require('../../mod/auth/handler')

const getWorkspace = require('../../mod/workspace/get')

const workspace = getWorkspace()

const dbs = require('../../mod/pg/dbs')()

const sql_filter = require('../../mod/pg/sql_filter')

module.exports = (req, res) => auth(req, res, handler, {
  public: true
})

async function handler(req, res, token = {}) {

  if (req.query.clear_cache) {
    Object.assign(workspace, getWorkspace())
    return res.end()
  }

  Object.assign(workspace, await workspace)

  const locale = workspace.locales[req.query.locale]

  const layer = locale.layers[req.query.layer]

  let
    table = req.query.table,
    geom = layer.geom,
    label = req.query.label,
    west = parseFloat(req.query.west),
    south = parseFloat(req.query.south),
    east = parseFloat(req.query.east),
    north = parseFloat(req.query.north)


  // Combine filter with envelope
  const where_sql = `
  WHERE ST_DWithin(
    ST_MakeEnvelope(${west}, ${south}, ${east}, ${north}, ${parseInt(layer.srid)}),
    ${geom}, 0.00001)
    ${req.query.filter && await sql_filter(JSON.parse(req.query.filter)) || ''}`


  var q = `
  SELECT
    ${label} AS label,
    ST_X(ST_PointOnSurface(${geom})) AS x,
    ST_Y(ST_PointOnSurface(${geom})) AS y
  FROM ${table} ${where_sql}`


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