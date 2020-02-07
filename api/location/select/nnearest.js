const requestBearer = require('../../../mod/requestBearer')

const layer = require('../../../mod/layer')

const dbs = require('../../../mod/pg/dbs')()

const sql_filter = require('../../../mod/pg/sql_filter')

const sql_fields = require('../../../mod/pg/sql_fields')

module.exports = (req, res) => requestBearer(req, res, [ layer, handler ], {
  public: true
})

async function handler(req, res) {

  const layer = req.params.layer

  const filter_sql = req.query.filter && await sql_filter(JSON.parse(req.query.filter)) || '' 

  let
    lat = req.query.lat,
    lng = req.query.lng,
    nnearest = parseInt(req.query.nnearest || 3),
    infoj = JSON.parse(JSON.stringify(layer.infoj)),
    geom = req.query.geom || layer.geom

  // The fields array stores all fields to be queried for the location info.
  const fields = await sql_fields([], infoj)

  // Push JSON geometry field into fields array.
  fields.push(` ST_asGeoJson(${geom}) AS geomj`)

  var q = `
  SELECT ${fields.join()}
  FROM ${req.query.table}
  WHERE true ${filter_sql} 
  ORDER BY ST_SetSRID(ST_Point(${lng}, ${lat}), 4326) <#> ${geom}
  LIMIT ${nnearest};`

  var rows = await dbs[layer.dbs](q)

  if (rows instanceof Error) return res.status(500).send('Failed to query PostGIS table.')

  // return 204 if no record was returned from database.
  if (rows.length === 0) return res.status(202).send('No rows returned from table.')

  // Send the infoj object with values back to the client.
  res.send(rows)

}