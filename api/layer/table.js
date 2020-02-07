const requestBearer = require('../../mod/requestBearer')

const layer = require('../../mod/layer')

const dbs = require('../../mod/pg/dbs')()

const sql_filter = require('../../mod/pg/sql_filter')

module.exports = (req, res) => requestBearer(req, res, [ layer, handler ], {
  public: true
})

async function handler(req, res) {

  const layer = req.params.layer

  const filter_sql = req.query.filter && await sql_filter(JSON.parse(req.query.filter)) || ''

  let
    table = layer.dataview[req.query.table],
    viewport = req.query.viewport,
    orderby = req.query.orderby || layer.qID,
    order = req.query.order || 'ASC',
    west = parseFloat(req.query.west),
    south = parseFloat(req.query.south),
    east = parseFloat(req.query.east),
    north = parseFloat(req.query.north),
    viewport_sql = 'WHERE true '

  if (viewport && layer.geom) {

    viewport_sql = `
    WHERE
      ST_DWithin(
        ST_Transform(
          ST_MakeEnvelope(${west}, ${south}, ${east}, ${north}, ${req.query.mapview_srid}),
          ${layer.srid}),
        ${layer.geom},
      0.00001)`
  }

  const fields = []

  const laterals = []

  await table.columns.forEach(async col => {

    if (col.lateral) {

      fields.push(`${col.field}.${col.field} AS ${col.field}`)

      laterals.push(`
      LEFT JOIN LATERAL (
        SELECT ${col.lateral.select} AS ${col.field}
        FROM ${col.lateral.from}
        WHERE ${col.lateral.where}) ${col.field} ON true`)

      return
    }

    if (col.field) return fields.push(`${col.fieldfx || col.field} AS ${col.field}`)

  })

  var q = `
  SELECT
    ${layer.qID} AS qID,
    ${fields.join()}
  FROM
    ${table.from}
    ${laterals.join(' ')}
    ${viewport_sql}
    ${filter_sql}
  ORDER BY ${orderby} ${order}
  FETCH FIRST ${table.limit || 99} ROW ONLY;`

  // OFFSET ${offset} ROWS

  var rows = await dbs[layer.dbs](q)

  if (rows instanceof Error) return res.status(500).send('Failed to query PostGIS table.')

  res.send(rows)

}