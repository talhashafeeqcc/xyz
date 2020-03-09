const auth = require('../../../mod/auth/handler')({
  public: true
})

const dbs = require('../../../mod/pg/dbs')()

const _layers = require('../../../mod/workspace/layers')

const sql_fields = require('../../../mod/pg/sql_fields')

module.exports = async (req, res) => {

  await auth(req, res)

  const layers = await _layers(req, res)

  if (res.finished) return

  const layer = layers[req.params.layer]

  const geom_extent = `ST_Transform(ST_SetSRID(ST_Extent(${layer.geom}), ${layer.srid}), 4326)`

  const roles = layer.roles && req.params.token.roles && req.params.token.roles.filter(
    role => layer.roles[role]).map(
      role => layer.roles[role]) || []

  const filter = await sql_filter(Object.assign(
    {},
    req.params.filter && JSON.parse(req.params.filter) || {},
    roles.length && Object.assign(...roles) || {}))

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
  FROM ${req.params.table}
  WHERE true ${filter};`

  var rows = await dbs[layer.dbs](q)

  if (rows instanceof Error) return res.status(500).send('Failed to query PostGIS table.')

  // Send the infoj object with values back to the client.
  res.send({
    geomj: rows[0].geomj,
    infoj: infoj
  })

}