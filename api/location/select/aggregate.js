const auth = require('../../../mod/auth/handler')

const _workspace = require('../../../mod/workspace/get')()

const dbs = require('../../../mod/pg/dbs')()

const sql_filter = require('../../../mod/pg/sql_filter')

const sql_fields = require('../../../mod/pg/sql_fields')

module.exports = (req, res) => auth(req, res, handler, {
  public: true
})

async function handler(req, res, token = {}) {

  const workspace = await _workspace

  const locale = workspace.locales[req.query.locale]

  const layer = locale.layers[req.query.layer]

  const geom_extent = `ST_Transform(ST_SetSRID(ST_Extent(${layer.geom}), ${layer.srid}), 4326)`

  // SQL filter
  const filter_sql = req.query.filter && await sql_filter(JSON.parse(req.query.filter)) || ''

  const infoj = layer.filter.infoj

  // The fields array stores all fields to be queried for the location info.
  const fields = await sql_fields([], infoj)

  var q = `
  SELECT
    ST_asGeoJson(
      ST_Transform(
        ST_SetSRID(
          ST_Buffer(
            ST_Transform(
              ST_SetSRID(${geom_extent},4326),
            3857),
            ST_Distance(
              ST_Transform(
                ST_SetSRID(
                  ST_Point(
                    ST_XMin(ST_Envelope(${geom_extent})),
                    ST_YMin(ST_Envelope(${geom_extent}))
                  ),
                4326),
              3857),
            ST_Transform(
              ST_SetSRID(
                ST_Point(
                  ST_XMax(ST_Envelope(${geom_extent})),
                  ST_Ymin(ST_Envelope(${geom_extent}))
                ),
              4326),
            3857)
          ) * 0.1
        ),
      3857),
    ${layer.srid})) AS geomj,
    ${fields.join()}
  FROM ${req.query.table}
  WHERE true ${filter_sql};`

  var rows = await dbs[layer.dbs](q)

  if (rows instanceof Error) return res.status(500).send('Failed to query PostGIS table.')

  // Send the infoj object with values back to the client.
  res.status(200).send({
    geomj: rows[0].geomj,
    infoj: infoj
  })

}