const auth = require('../mod/auth/handler')

const dbs = require('../mod/dbs')()

const sql_filter = require('../mod/layer/sql_filter')

const _layers = require('../mod/workspace/layers')

const _templates = require('../mod/workspace/templates')

module.exports = async (req, res) => {

  req.params = Object.assign(req.params || {}, req.query || {})

  const layers = await _layers(req)

  const templates = await _templates(req)

  if (req.params.clear_cache) return res.end()

  const template = templates[decodeURIComponent(req.params.template)]

  if(!template) return res.status(404).send('Template not found')

  if (template.err) return res.status(500).send(template.err)

  await auth(req, res, template.access)

  if (res.finished) return

  if (req.params.locale && req.params.layer) {

    const layer = layers[req.params.layer]

    const roles = layer.roles && req.params.token.roles && req.params.token.roles.filter(
      role => layer.roles[role]).map(
        role => layer.roles[role]) || []

    const filter = await sql_filter(Object.assign(
      {},
      req.params.filter && JSON.parse(req.params.filter) || {},
      roles.length && Object.assign(...roles) || {}))

    req.params.viewport = req.params.viewport && req.params.viewport.split(',')
    
    const viewport = req.params.viewport && `
    AND ST_DWithin(
      ST_MakeEnvelope(
        ${req.params.viewport[0]},
        ${req.params.viewport[1]},
        ${req.params.viewport[2]},
        ${req.params.viewport[3]},
        ${parseInt(req.params.viewport[4])}
      ),
      ${layer.geom}, 0.00001)` || ''

    Object.assign(req.params, {layer: layer, filter: filter, viewport: viewport})
  }

  try {
    var q = template.render(req.params)
  } catch(err) {
    res.status(500).send(err.message)
    return console.error(err)
  }

  const rows = await dbs[template.dbs || req.params.dbs || req.params.layer.dbs](q)

  if (rows instanceof Error) return res.status(500).send('Failed to query PostGIS table.')

  // return 204 if no record was returned from database.
  if (!rows || !rows.length) return res.status(202).send('No rows returned from table.')

  // Send the infoj object with values back to the client.
  res.send(rows.length === 1 && rows[0] || rows)
}