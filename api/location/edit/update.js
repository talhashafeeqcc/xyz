const auth = require('../../../mod/auth/handler')({
  public: true
})

const dbs = require('../../../mod/pg/dbs')()

const _layers = require('../../../mod/workspace/layers')

let layers

const sql_fields = require('../../../mod/pg/sql_fields')

const sql_infoj = require('../../../mod/pg/sql_infoj')

module.exports = async (req, res) => {

  await auth(req, res)

  layers = await _layers(req, res)

  if (res.finished) return

  const layer = layers[req.params.layer]

  var fields = await sql_infoj(req.body.infoj)

  var q = `UPDATE ${req.query.table} SET ${fields} WHERE ${layer.qID} = $1;`

  var rows = await dbs[layer.dbs](q, [req.query.id])

  if (rows instanceof Error) return res.status(500).send('PostgreSQL query error - please check backend logs.')

  // Remove tiles from mvt_cache.
  if (layer.mvt_cache) {
    await dbs[layer.dbs](`
      DELETE FROM ${layer.mvt_cache}
      WHERE ST_Intersects(tile, (
        SELECT ${layer.geom}
        FROM ${req.query.table}
        WHERE ${layer.qID} = $1));`,
        [req.query.id])
  }

  // Query field for updated infoj
  const infoj = JSON.parse(JSON.stringify(layer.infoj))

  // The fields array stores all fields to be queried for the location info.
  var fields = await sql_fields([], infoj, layer.qID)

  var q = `
  SELECT ${fields.join()}
  FROM ${req.query.table}
  WHERE ${layer.qID} = $1;`

  var rows = await dbs[layer.dbs](q, [req.query.id])

  if (rows instanceof Error) return res.status(500).send('Failed to query PostGIS table.')

  // Send the infoj object with values back to the client.
  res.send(rows[0])

}