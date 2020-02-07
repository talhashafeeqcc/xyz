const requestBearer = require('../../mod/requestBearer')

const sql_filter = require('../../mod/pg/sql_filter')

const layer = require('../../mod/layer')

const dbs = require('../../mod/pg/dbs')()

module.exports = (req, res) => requestBearer(req, res, [ layer, handler ], {
  public: true
});

async function handler(req, res) {

  const layer = req.params.layer

  const filter_sql = req.query.filter && await sql_filter(JSON.parse(req.query.filter)) || '';

  let
    table = req.query.table,
    geom = layer.geom,
    mapview_srid = req.query.mapview_srid,
    id = layer.qID || null,
    x = parseInt(req.query.x),
    y = parseInt(req.query.y),
    z = parseInt(req.query.z),
    m = 20037508.34,
    r = (m * 2) / (Math.pow(2, z))

  // Use MVT cache if set on layer and no filter active.
  const mvt_cache = (!filter_sql && (!layer.roles || !Object.keys(layer.roles).length) && layer.mvt_cache)

  if (mvt_cache) {

    // Get MVT from cache table.
    var rows = await dbs[layer.dbs](`SELECT mvt FROM ${layer.mvt_cache} WHERE z = ${z} AND x = ${x} AND y = ${y}`)

    if (rows instanceof Error) console.log('failed to query mvt cache')

    // If found return the cached MVT to client.
    if (rows.length === 1) return res.send(rows[0].mvt)

  }

  // Construct array of fields queried
  const mvt_fields = Object.values(layer.style.themes || {}).map(
    theme => theme.fieldfx && `${theme.fieldfx} AS ${theme.field}` || theme.field)

  // Create a new tile and store in cache table if defined.
  // ST_MakeEnvelope() in ST_AsMVT is based on https://github.com/mapbox/postgis-vt-util/blob/master/src/TileBBox.sql
  var q = `
    ${mvt_cache ? `INSERT INTO ${layer.mvt_cache} (z, x, y, mvt, tile)` : ''}
    SELECT
      ${z},
      ${x},
      ${y},
      ST_AsMVT(tile, '${req.query.layer}', 4096, 'geom') mvt,
      ST_MakeEnvelope(
        ${-m + (x * r)},
        ${ m - (y * r)},
        ${-m + (x * r) + r},
        ${ m - (y * r) - r},
        ${mapview_srid}
      ) tile

    FROM (

      SELECT
        ${id} as id,
        ${mvt_fields.length && mvt_fields.toString() + ',' || ''}
        ST_AsMVTGeom(
          ${geom},
          ST_MakeEnvelope(
            ${-m + (x * r)},
            ${ m - (y * r)},
            ${-m + (x * r) + r},
            ${ m - (y * r) - r},
            ${mapview_srid}
          ),
          4096,
          256,
          true
        ) geom

      FROM ${table}

      WHERE
        ST_DWithin(
          ST_MakeEnvelope(
            ${-m + (x * r)},
            ${ m - (y * r)},
            ${-m + (x * r) + r},
            ${ m - (y * r) - r},
            ${mapview_srid}
          ),
          ${geom},
          ${r / 4}
        )

        ${filter_sql}

    ) tile
    
    ${mvt_cache ? 'RETURNING mvt;' : ';'}`

  var rows = dbs[layer.dbs] && await dbs[layer.dbs](q)

  if (rows instanceof Error) return res.status(500).send('Failed to query PostGIS table.')

  // Return MVT to client.
  res.send(rows[0].mvt);

}