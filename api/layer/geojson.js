const auth = require('../../mod/auth/handler')({
  public: true
})

const dbs = require('../../mod/pg/dbs')()

const sql_filter = require('../../mod/pg/sql_filter')

const _layers = require('../../mod/workspace/layers')

const layers = []

module.exports = async (req, res) => {

  await auth(req, res)

  Object.assign(layers, [], await _layers(req, res))

  if (res.finished) return

  const layer = layers[req.params.layer]

  const roles = layer.roles && req.params.token.roles && req.params.token.roles.filter(
    role => layer.roles[role]).map(
      role => layer.roles[role]) || []

  const filter = await sql_filter(Object.assign(
    {},
    req.query.filter && JSON.parse(req.query.filter) || {},
    roles.length && Object.assign(...roles) || {}))

  var q = `
  SELECT
    ${layer.qID || null} AS id,
    ${req.query.cat || null} AS cat,
    ST_asGeoJson(${layer.geom}) AS geomj
  FROM ${req.query.table}
  WHERE true ${filter};`

  var rows = await dbs[layer.dbs](q)

  if (rows instanceof Error) return res.status(500).send('Failed to query PostGIS table.')

  res.send(rows.map(row => ({
    type: 'Feature',
    geometry: JSON.parse(row.geomj),
    properties: {
      id: row.id,
      cat: row.cat
    }
  })))

}