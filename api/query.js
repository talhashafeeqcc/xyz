const auth = require('../mod/auth/handler')({
  public: true
})

const dbs = require('../mod/pg/dbs')()

const acl = require('../mod/auth/acl')()

const sql_filter = require('../mod/pg/sql_filter')

const _layers = require('../mod/workspace/layers')

const _templates = require('../mod/workspace/templates')

module.exports = async (req, res) => {

  await auth(req, res)

  const layers = await _layers(req, res)

  const templates = await _templates(req, res)

  if (res.finished) return

  const template = templates[req.params.template]

  if(!template) return res.status(500).send('Template not found')

  const token = req.params.token || {}

  const params = req.query || {}

  if (template.admin_user && !token) return res.status(401).send('Insuficient privileges.')

  if (template.admin_workspace && !token) return res.status(401).send('Insuficient privileges.')

  if (req.params.locale && req.params.layer) {

    const layer = layers[req.params.layer]

    const roles = layer.roles && req.params.token.roles && req.params.token.roles.filter(
      role => layer.roles[role]).map(
        role => layer.roles[role]) || []

    const filter = await sql_filter(Object.assign(
      {},
      req.params.filter && JSON.parse(req.params.filter) || {},
      roles.length && Object.assign(...roles) || {}))

    Object.assign(params, {layer: layer, filter: filter})
  }

  const q = template.render(params)

  const rows = template.admin_user && token && token.admin_user ?
    await acl(q) :
    await dbs[template.dbs || params.dbs || params.layer.dbs](q)

  if (rows instanceof Error) return res.status(500).send('Failed to query PostGIS table.')

  // return 204 if no record was returned from database.
  if (!rows || !rows.length) return res.status(202).send('No rows returned from table.')

  // Send the infoj object with values back to the client.
  res.send(rows.length === 1 && rows[0] || rows)

}