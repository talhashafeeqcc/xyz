const auth = require('../../mod/auth/handler')({
  public: true
})

const dbs = require('../../mod/dbs')()

const _layers = require('../../mod/workspace/layers')

module.exports = async (req, res) => {

  await auth(req, res)

  const layers = await _layers(req, res)

  if (res.finished) return

  const layer = layers[req.params.layer]

  let
    table = req.params.table,
    geom = layer.geom,
    size = req.params.size,
    color = req.params.color,
    viewport = req.params.viewport.split(',')

  var q = `
  SELECT
    ST_X(ST_Transform(${layer.geom}, ${layer.srid})) x,
    ST_Y(ST_Transform(${layer.geom}, ${layer.srid})) y,
    ${size} size,
    ${color} color
  FROM ${table}
  WHERE
    ST_DWithin(
      ST_MakeEnvelope(${viewport[0]}, ${viewport[1]}, ${viewport[2]}, ${viewport[3]}, ${layer.srid}),
    ${geom}, 0.000001)
    AND ${size} >= 1 LIMIT 10000;`


  var rows = await dbs[layer.dbs](q)

  if (rows instanceof Error) return res.status(500).send('Failed to query PostGIS table.')

  if (rows.length === 0) return res.status(204).send()

  res.send(rows.map(row => Object.keys(row).map(field => row[field])))

}