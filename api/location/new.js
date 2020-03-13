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
 
  var q = `
  INSERT INTO ${req.params.table} (${layer.geom})
  SELECT ST_SetSRID(ST_GeomFromGeoJSON('${JSON.stringify(req.body.geometry)}'), ${layer.srid})
  RETURNING ${layer.qID} AS id;`

  var rows = await dbs[layer.dbs](q)

  if (rows instanceof Error) return res.status(500).send('Failed to query PostGIS table.')

  if (layer.mvt_cache) await dbs[layer.dbs](`
  DELETE FROM ${layer.mvt_cache}
  WHERE ST_Intersects(tile, (
    SELECT ${layer.geom}
    FROM ${req.params.table}
    WHERE ${layer.qID} = $1));`, [rows[0].id])

  res.send(rows[0].id.toString())

}