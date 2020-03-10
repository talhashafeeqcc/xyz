const auth = require('../../mod/auth/handler')({
  public: true
})

const _layers = require('../../mod/workspace/layers')

const dbs = require('../../mod/pg/dbs')()

const sql_fields = require('../../mod/pg/sql_fields')

module.exports = async (req, res) => {

  await auth(req, res)

  const layers = await _layers(req, res)

  if (res.finished) return

  const layer = layers[req.params.layer]

  // Clone the infoj from the memory workspace layer.
  const infoj = layer.infoj && JSON.parse(JSON.stringify(layer.infoj))

  // The fields array stores all fields to be queried for the location info.    
  const fields = (infoj && await sql_fields([], infoj)) || []

  // Push JSON geometry field into fields array.
  fields.push(` ST_asGeoJson(${layer.geom}, 4) AS geomj`)

  var q = `
  SELECT ${fields.join()}
  FROM ${req.params.table}
  WHERE ${layer.qID} = $1`

  var rows = await dbs[layer.dbs](q, [req.params.id])

  if (rows instanceof Error) return res.status(500).send('Failed to query PostGIS table.')

  // return 204 if no record was returned from database.
  if (rows.length === 0) return res.status(202).send('No rows returned from table.')

  // Send the infoj object with values back to the client.
  res.send(rows[0])

}