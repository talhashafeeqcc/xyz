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

  if (layer.mvt_cache) {

    var q = `
    DELETE FROM ${layer.mvt_cache} 
    WHERE
      ST_Intersects(
        tile, 
        (SELECT ${layer.geom} FROM ${req.query.table} WHERE ${layer.qID} = $1));`;

    await dbs[layer.dbs](q, [req.query.id])

  }

  var rows = await dbs[layer.dbs](`DELETE FROM ${req.query.table} WHERE ${layer.qID} = $1;`, [req.query.id])

  if (rows instanceof Error) return res.status(500).send('PostgreSQL query error - please check backend logs.')

  res.send('Location delete successful')

}