const auth = require('../../../mod/auth/handler')({
  public: true
})

const dbs = require('../../../mod/pg/dbs')()

const _layers = require('../../../mod/workspace/layers')

module.exports = async (req, res) => {

  await auth(req, res)

  const layers = await _layers(req, res)

  if (res.finished) return

  const layer = layers[req.params.layer]

  const geometry = JSON.stringify(req.body.geometry)
  
  const properties = req.body.properties

  var q = `
  INSERT INTO ${req.params.table} (${layer.geom}${properties ? ',' + Object.keys(properties)[0] : ''})
  SELECT
    ST_SetSRID(ST_GeomFromGeoJSON('${geometry}'), ${layer.srid})
    ${properties ? ',\'' + Object.values(properties)[0] + '\'' : ''}
  RETURNING ${layer.qID} AS id;`

  var rows = await dbs[layer.dbs](q)

  if (rows instanceof Error) return res.status(500).send('Failed to query PostGIS table.')

  if (layer.mvt_cache) {

    var q = `
      DELETE FROM ${layer.mvt_cache} 
      WHERE
        ST_Intersects(tile, 
          (SELECT ${layer.geom} FROM ${req.params.table} WHERE ${layer.qID} = $1));`

    await dbs[layer.dbs](q, [rows[0].id])
  }

  res.send(rows[0].id.toString())

}