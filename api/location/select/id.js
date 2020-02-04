const auth = require('../../../mod/auth/handler')

const infoj_values = require('../../../mod/infoj_values.js')

const _workspace = require('../../../mod/workspace/get')()

module.exports = (req, res) => auth(req, res, handler, {
  public: true
})

async function handler(req, res, token = {}) {

  const workspace = await _workspace

  const locale = workspace.locales[req.query.locale]

  const layer = locale.layers[req.query.layer]

  const rows = await infoj_values({
    locale: locale,
    layer: layer,
    table: req.query.table,
    id: req.query.id,
    roles: token.roles || []
  })

  if (rows instanceof Error) return res.status(500).send('Failed to query PostGIS table.')

  // return 204 if no record was returned from database.
  if (rows.length === 0) return res.status(202).send('No rows returned from table.')

  // Send the infoj object with values back to the client.
  res.send(rows[0])

}