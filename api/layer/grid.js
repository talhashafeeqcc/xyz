const auth = require('../../mod/auth/handler')({
  public: true
})

const dbs = require('../../mod/pg/dbs')()

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
    srid = layer.srid,
    west = parseFloat(req.params.west),
    south = parseFloat(req.params.south),
    east = parseFloat(req.params.east),
    north = parseFloat(req.params.north)

  var q = `
  SELECT
    ST_X(ST_Transform(${layer.geom},${srid})) x,
    ST_Y(ST_Transform(${layer.geom},${srid})) y,
    ${size} size,
    ${color} color
  FROM ${table}
  WHERE
    ST_DWithin(
      ST_MakeEnvelope(${west}, ${south}, ${east}, ${north}, ${srid}),
    ${geom}, 0.000001)
    AND ${size} >= 1 LIMIT 10000;`


  var rows = await dbs[layer.dbs](q)

  if (rows instanceof Error) return res.status(500).send('Failed to query PostGIS table.')

  if (rows.length === 0) return res.status(204).send()

  res.send(rows.map(row => Object.keys(row).map(field => row[field])))

}