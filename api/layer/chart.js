const requestBearer = require('../../mod/requestBearer')

const layer = require('../../mod/layer')

const dbs = require('../../mod/pg/dbs')()

const sql_filter = require('../../mod/pg/sql_filter')

const sql_fields = require('../../mod/pg/sql_fields')

module.exports = (req, res) => requestBearer(req, res, [ layer, handler ], {
  public: true
})

async function handler(req, res) {

  const layer = req.params.layer

  const chart = layer.dataview[req.query.chart]

  const filter_sql = req.query.filter && await sql_filter(JSON.parse(req.query.filter)) || ''

  let
    viewport = req.query.viewport,
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