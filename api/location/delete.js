const auth = require('../../mod/auth/handler')({
  public: true
})

const dbs = require('../../mod/dbs')()

const _layers = require('../../mod/workspace/layers')

module.exports = async (req, res) => {

  await auth(req, res)

  const layers = await _layers(req, res)

  if (req.query.clear_cache) return res.end()

  if (res.finished) return

  const layer = layers[req.params.layer]

  if (layer.mvt_cache) await dbs[layer.dbs](`
  DELETE FROM ${layer.mvt_cache}
  WHERE ST_Intersects(tile, (
    SELECT ${layer.geom}
    FROM ${req.params.table}
    WHERE ${layer.qID} = $1));`, [req.params.id])

  var rows = await dbs[layer.dbs](`
  DELETE FROM ${req.params.table} WHERE ${layer.qID} = $1;`, [req.params.id])

  if (rows instanceof Error) return res.status(500).send('PostgreSQL query error - please check backend logs.')

  res.send('Location delete successful')

}