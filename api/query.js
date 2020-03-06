const auth = require('../mod/auth/handler')({
  public: true
})

const dbs = require('../mod/pg/dbs')()

const acl = require('../mod/auth/acl')()

const sql_filter = require('../mod/pg/sql_filter')

const _layers = require('../mod/workspace/layers')

let layers

const _templates = require('../mod/workspace/templates')

let templates

module.exports = async (req, res) => {

  await auth(req, res)

  layers = await _layers(req, res)

  templates = await _templates(req, res)

  if (res.finished) return

  const template = templates[req.query.template]

  const token = req.params.token || {}

  const params = req.query || {}

  if(!template) console.log(`Template ${req.query.template} not found`)

  if (template.admin_user && !token) return res.status(401).send('Insuficient privileges.')

  if (template.admin_workspace && !token) return res.status(401).send('Insuficient privileges.')

  if (req.query.locale && req.query.layer) {

    const layer = layers[req.query.layer]

    const roles = layer.roles && req.params.token.roles && req.params.token.roles.filter(
      role => layer.roles[role]).map(
        role => layer.roles[role]) || []

    const filter = await sql_filter(Object.assign(
      {},
      req.query.filter && JSON.parse(req.query.filter) || {},
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