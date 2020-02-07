const requestBearer = require('../../../mod/requestBearer')

const layer = require('../../../mod/layer')

const dbs = require('../../../mod/pg/dbs')()

const sql_filter = require('../../../mod/pg/sql_filter')

module.exports = (req, res) => requestBearer(req, res, [ layer, handler ], {
  public: true
})

async function handler(req, res) {

  const layer = req.params.layer

  const filter_sql = req.query.filter && await sql_filter(JSON.parse(req.query.filter)) || ''

  let
    table = req.query.table,
    geom = layer.geom,
    qID = layer.qID,
    coords = req.query.coords.split(',').map(xy => parseFloat(xy)),
    label = layer.cluster_label ? layer.cluster_label : qID,
    count = parseInt(req.query.count) || 99

  // Query the feature count from lat/lng bounding box.
  var q = `
  SELECT
    ${qID} AS ID,
    ${label} AS label,
    array[st_x(st_centroid(${geom})), st_y(st_centroid(${geom}))] AS coords
  FROM ${table}
  WHERE true 
    ${filter_sql} 
  ORDER BY ST_Point(${coords}) <#> ${geom} LIMIT ${count};`

  var rows = await dbs[layer.dbs](q)

  if (rows instanceof Error) return res.status(500).send('Failed to query PostGIS table.')

  res.send(Object.keys(rows).map(record => ({
    id: rows[record].id,
    label: rows[record].label,
    coords: rows[record].coords
  })))

}