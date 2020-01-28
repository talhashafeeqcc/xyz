const auth = require('../../../mod/auth/handler')

const _workspace = require('../../../mod/workspace/get')()

const dbs = require('../../../mod/pg/dbs')()

module.exports = (req, res) => auth(req, res, handler, {
  public: true
})

async function handler(req, res, token = {}) {

  const workspace = await _workspace

  const locale = workspace.locales[req.query.locale]

  const layer = locale.layers[req.query.layer]

  let
    table = req.query.table,
    geom = layer.geom,
    qID = layer.qID,
    coords = req.query.coords.split(',').map(xy => parseFloat(xy)),
    filter = null, //req.params.filter,
    label = layer.cluster_label ? layer.cluster_label : qID,
    count = parseInt(req.query.count) || 99


  // SQL filter
  const filter_sql = filter && await sql_filter(filter) || ''

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