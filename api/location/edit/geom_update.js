const auth = require('../../../mod/auth/handler')({
  public: true
})

const dbs = require('../../../mod/pg/dbs')()

const _layers = require('../../../mod/workspace/layers')

let layers

module.exports = async (req, res) => {

  await auth(req, res)

  layers = await _layers(req, res)

  if (res.finished) return

  const layer = layers[req.params.layer]

  // delete old geometry from cache
  if (layer.mvt_cache) {
    var q = `
    DELETE FROM ${layer.mvt_cache} 
    WHERE ST_Intersects(
      tile,
      (SELECT ${layer.geom} FROM ${req.query.table} WHERE ${layer.qID} = $1));`

    await dbs[layer.dbs](q, [req.query.id])
  }

  var q = `
  UPDATE ${req.query.table}
  SET ${layer.geom} = ST_SetSRID(ST_GeomFromGeoJSON('${JSON.stringify(req.body)}'),${layer.srid})
  WHERE ${layer.qID} = ${req.query.id};`

  var rows = await dbs[layer.dbs](q)

  if (rows instanceof Error) return res.status(500).send('Failed to query PostGIS table.')

  // delete new geometry from cache
  if (layer.mvt_cache) {
    var q = `
    DELETE FROM ${layer.mvt_cache} 
    WHERE ST_Intersects(
      tile,
      (SELECT ${layer.geom} FROM ${req.query.table} WHERE ${layer.qID} = $1));`

    await dbs[layer.dbs](q, [req.query.id])
  }

  res.send()

}