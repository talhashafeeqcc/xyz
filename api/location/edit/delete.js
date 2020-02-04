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