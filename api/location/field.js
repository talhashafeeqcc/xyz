const auth = require('../../mod/auth/handler')

const _workspace = require('../../mod/workspace/get')()

const dbs = require('../../mod/pg/dbs')()

module.exports = (req, res) => auth(req, res, handler, {
  public: true
})

async function handler(req, res, token = {}) {

  const workspace = await _workspace

  const locale = workspace.locales[req.query.locale]

  const layer = locale.layers[req.query.layer]

  let
    table = req.query.table,
    field = req.query.field,
    coords = req.query.coords && req.query.coords.split(','),
    id = req.query.id,
    qID = layer.qID

  if (coords) {

    var rows = await dbs[layer.dbs](`
    SELECT ${field}
    FROM ${table}
    ORDER BY ST_Point(${coords}) <#> ${layer.geom} LIMIT 1;`)

  } else {

    var rows = await dbs[layer.dbs](`
    SELECT ${field}
    FROM ${table}
    WHERE ${qID} = $1;`, [id])
  }

  if (rows instanceof Error) return res.status(500).send('Failed to query PostGIS table.')

  // return 204 if no record was returned from database.
  if (rows.length === 0) return res.status(202).send('No rows returned from table.')

  // Send the infoj object with values back to the client.
  res.send({ field: rows[0][field] })

}