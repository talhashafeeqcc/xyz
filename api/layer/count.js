const auth = require('../../mod/auth/handler')

const getWorkspace = require('../../mod/workspace/get')

const workspace = getWorkspace()

const dbs = require('../../mod/pg/dbs')()

const sql_filter = require('../../mod/pg/sql_filter')

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

  const filter_sql = req.query.filter && await sql_filter(JSON.parse(req.query.filter)) || ''

  // Query the estimated extent for the layer geometry field from layer table.
  var rows = await dbs[layer.dbs](`
    SELECT count(1)
    FROM ${req.query.table}
    WHERE true ${filter_sql};`)

  if (rows instanceof Error) return res.status(500).send('Failed to query PostGIS table.')

  res.status(200).send(rows[0].count)

}