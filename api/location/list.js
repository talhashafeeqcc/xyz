const auth = require('../../mod/auth/handler')

const getWorkspace = require('../../mod/workspace/get')

const workspace = getWorkspace()

const dbs = require('../../mod/pg/dbs')()

module.exports = (req, res) => auth(req, res, handler, {
  public: true
})

async function handler(req, res, token = {}) {

  if (req.query.clear_cache) {
    Object.assign(workspace, getWorkspace())
    return res.end()
  }

  Object.assign(workspace, await workspace)

  const locale = workspace.locales[req.query.locale]

  const layer = locale.layers[req.query.layer]

  const tableDef = layer.infoj.find(entry => entry.title === decodeURIComponent(req.query.tableDef))

  const fields = tableDef.columns.map(col => `(${col.fieldfx || col.field})::${col.type || 'text'} AS ${col.field}`)

  var q = `
  SELECT ${fields.join(',')} 
  FROM ${tableDef.from}
  ${tableDef.where ? `WHERE ${tableDef.where}` : ``}
  ${tableDef.orderby ? `ORDER BY ${tableDef.orderby}` : ``} NULLS LAST
  LIMIT ${tableDef.limit || 100};`;

  const rows = await dbs[layer.dbs](q, [req.query.id])

  if (rows instanceof Error) return res.status(500).send('Failed to query PostGIS table.')

  res.send(rows)
}