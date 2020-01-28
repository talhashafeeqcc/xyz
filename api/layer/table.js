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

  let
    table = layer.dataview[req.query.table],
    viewport = req.query.viewport,
    filter = null, //req.params.filter,
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


  // SQL filter
  const filter_sql = filter && await sql_filter(filter) || ''

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