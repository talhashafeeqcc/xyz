const requestBearer = require('../../../mod/requestBearer')

const layer = require('../../../mod/layer')

const dbs = require('../../../mod/pg/dbs')()

const sql_filter = require('../../../mod/pg/sql_filter')

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

  let
    table = req.query.table,
    qID = layer.qID,
    coords = req.query.coords.split(',').map(xy => parseFloat(xy)),
    label = layer.cluster_label ? layer.cluster_label : qID,
    count = parseInt(req.query.count) || 99

  // Query the feature count from lat/lng bounding box.
  var q = `
  SELECT
    ${qID} AS ID,
    ${label} AS label,
    array[st_x(st_centroid(${layer.geom})), st_y(st_centroid(${layer.geom}))] AS coords
  FROM ${table}
  WHERE true 
    ${filter} 
  ORDER BY ST_Point(${coords}) <#> ${layer.geom} LIMIT ${count};`

  var rows = await dbs[layer.dbs](q)

  if (rows instanceof Error) return res.status(500).send('Failed to query PostGIS table.')

  res.send(Object.keys(rows).map(record => ({
    id: rows[record].id,
    label: rows[record].label,
    coords: rows[record].coords
  })))

}