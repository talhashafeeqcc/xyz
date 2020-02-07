const requestBearer = require('../../../mod/requestBearer')

const infoj_values = require('../../../mod/infoj_values.js')

const layer = require('../../../mod/layer')

module.exports = (req, res) => requestBearer(req, res, [ layer, handler ], {
  public: true
})

async function handler(req, res) {

  const layer = req.params.layer

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