const auth = require('../../mod/auth/handler')

const _workspace = require('../../mod/workspace/get')()

const dbs = require('../../mod/pg/dbs')()

const sql_filter = require('../../mod/pg/sql_filter')

const sql_fields = require('../../mod/pg/sql_fields')

module.exports = (req, res) => auth(req, res, handler, {
  public: true
})

async function handler(req, res, token = {}) {

  const workspace = await _workspace

  const locale = workspace.locales[req.query.locale]

  const layer = locale.layers[req.query.layer]

  const chart = layer.dataview[req.query.chart]

  let
    viewport = req.query.viewport,
    filter = null //req.params.filter;
    orderby = req.query.orderby || layer.qID,
    order = req.query.order || 'ASC',
    mapview_srid = req.query.mapview_srid,
    west = parseFloat(req.query.west),
    south = parseFloat(req.query.south),
    east = parseFloat(req.query.east),
    north = parseFloat(req.query.north),
    viewport_sql = 'WHERE true '

  if (viewport) {

    viewport_sql = `
    WHERE
      ST_DWithin(
        ST_MakeEnvelope(${west}, ${south}, ${east}, ${north}, ${mapview_srid}),
      ${layer.geom}, 0.00001)`

  }

  // SQL filter
  const filter_sql = filter && await sql_filter(filter) || ''

  const fields = await sql_fields([], chart.columns)

  var q = `
  SELECT
    ${layer.qID} AS qID,
    ${fields}
  FROM ${chart.from}
    ${viewport_sql}
    ${filter_sql}
  ORDER BY ${orderby} ${order}
  FETCH FIRST 99 ROW ONLY;`

  var rows = await dbs[layer.dbs](q)

  if (rows instanceof Error) return res.status(500).send('Failed to query PostGIS table.')

  res.send(rows)
}