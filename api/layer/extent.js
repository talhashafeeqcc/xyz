const auth = require('../../mod/auth/handler')

const _workspace = require('../../mod/workspace/get')()

const dbs = require('../../mod/pg/dbs')()

const sql_filter = require('../../mod/pg/sql_filter')

module.exports = (req, res) => auth(req, res, handler, {
  public: true
})

async function handler(req, res, token = {}) {

  const workspace = await _workspace

  const locale = workspace.locales[req.query.locale]

  const layer = locale.layers[req.query.layer]

  const filter = null //req.params.filter;

  // SQL filter
  const filter_sql = filter && await sql_filter(filter) || ''

  // Get table entry from layer or min table in from tables array.
  const table = layer.table || Object.values(layer.tables)[0] || Object.values(layer.tables)[1];

  var geom = `Box2D(ST_Transform(ST_SetSRID(ST_Extent(${layer.geom}), ${layer.srid}), ${req.query.mapview_srid}))`;

  // Query the estimated extent for the layer geometry field from layer table.
  var rows = await dbs[layer.dbs](`
  SELECT ${geom}
  FROM ${table}
  WHERE true ${filter_sql};`)

  if (rows instanceof Error) return res.status(500).send('Failed to query PostGIS table.')

  // Get bounds from first row value.
  const bounds = Object.values(Object.values(rows)[0])[0]

  // Return 204 if bounds couldn't be formed.
  if (!bounds) return res.status(204).send('No bounds.')

  // Regex format bounds as comma separated string and return to client.
  res.send(/\((.*?)\)/.exec(bounds)[1].replace(/ /g, ','))

}