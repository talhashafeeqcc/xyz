const auth = require('../../../mod/auth/handler')({
  public: true
})

const _layers = require('../../../mod/workspace/layers')

let layers

const infoj_values = require('../../../mod/infoj_values.js')

module.exports = async (req, res) => {

  await auth(req, res)

  layers = await _layers(req, res)

  if (res.finished) return

  const layer = layers[req.params.layer]

  const rows = await infoj_values({
    layer: layer,
    table: req.query.table,
    id: req.query.id,
    roles: req.params.token.roles || []
  })

  if (rows instanceof Error) return res.status(500).send('Failed to query PostGIS table.')

  // return 204 if no record was returned from database.
  if (rows.length === 0) return res.status(202).send('No rows returned from table.')

  // Send the infoj object with values back to the client.
  res.send(rows[0])

}