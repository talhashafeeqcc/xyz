const auth = require('../../mod/auth/handler')

const getWorkspace = require('../../mod/workspace/get')

const workspace = getWorkspace()

const dbs = require('../../mod/pg/dbs')()

const sql_filter = require('../../mod/pg/sql_filter')

module.exports = (req, res) => auth(req, res, handler, {
  public: true
});

async function handler(req, res, token = {}) {

  if (req.query.clear_cache) {
    Object.assign(workspace, getWorkspace())
    return res.end()
  }

  Object.assign(workspace, await workspace)

  const locale = workspace.locales[req.query.locale]

  const layer = locale.layers[req.query.layer]

  const filter_sql = req.query.filter && await sql_filter(req.query.filter) || ' true';


  var q = `
  SELECT
    ${layer.qID || null} AS id,
    ${req.query.cat || null} AS cat,
    ST_asGeoJson(${layer.geom}) AS geomj
  FROM ${req.query.table}
  WHERE ${filter_sql};`

  var rows = await dbs[layer.dbs](q)

  if (rows instanceof Error) return res.status(500).send('Failed to query PostGIS table.')

  res.send(rows.map(row => ({
    type: 'Feature',
    geometry: JSON.parse(row.geomj),
    properties: {
      id: row.id,
      cat: row.cat
    }
  })))

}