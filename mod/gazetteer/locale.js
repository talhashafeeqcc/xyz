const dbs = require('../pg/dbs')()

const sql_filter = require('../pg/sql_filter')

module.exports = async (req, locale) => {

  // Loop through dataset entries in gazetteer configuration.
  for (let dataset of locale.gazetteer.datasets) {

    const layer = locale.layers[dataset.layer]

    const roles = layer.roles && req.params.token.roles && req.params.token.roles.filter(
      role => layer.roles[role]).map(
        role => layer.roles[role]) || []
  
    const filter = await sql_filter(Object.assign(
      {},
      req.query.filter && JSON.parse(req.query.filter) || {},
      roles.length && Object.assign(...roles) || {}))

    // Build PostgreSQL query to fetch gazetteer results.
    var q = `
    SELECT
      ${dataset.label} AS label,
      ${layer.qID} AS id,
      ST_X(ST_PointOnSurface(${layer.geom || 'geom'})) AS lng,
      ST_Y(ST_PointOnSurface(${layer.geom || 'geom'})) AS lat
      FROM ${dataset.table}
      WHERE ${dataset.qterm || dataset.label}::text ILIKE $1
      ${filter}
      ORDER BY length(${dataset.label})
      LIMIT 10`

    // Get gazetteer results from dataset table.
    var rows = await dbs[layer.dbs](q, [`${dataset.leading_wildcard ? '%': ''}${decodeURIComponent(req.query.q)}%`])

    if (rows instanceof Error) return {err: 'Error fetching gazetteer results.'}

    // Format JSON array of gazetteer results from rows object.
    if (rows.length > 0) return Object.values(rows).map(row => ({
      label: row.label,
      id: row.id,
      table: dataset.table,
      layer: dataset.layer,
      marker: `${row.lng},${row.lat}`,
      source: 'glx'
    }))

  }

  // Return empty results array if no results where found in any dataset.
  return []
}