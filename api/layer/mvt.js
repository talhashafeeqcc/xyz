const auth = require('../../mod/auth/handler');

const _workspace = require('../../mod/workspace/get')();

const dbs = require('../../mod/pg/dbs')();

module.exports = (req, res) => auth(req, res, handler, {
  public: true
});

async function handler(req, res, token = {}){

  const workspace = await _workspace;

  const locale = workspace.locales[req.query.locale];

  let
    layer = locale.layers[req.query.layer],
    table = req.query.table,
    geom = layer.geom,
    mapview_srid = req.query.mapview_srid,
    filter = null, //req.params.filter,
    id = layer.qID || null,
    x = parseInt(req.query.x),
    y = parseInt(req.query.y),
    z = parseInt(req.query.z),
    m = 20037508.34,
    r = (m * 2) / (Math.pow(2, z));

    // SQL filter
    const filter_sql = filter && await sql_filter(filter) || '';

    // Use MVT cache if set on layer and no filter active.
    const mvt_cache = null;//(!filter_sql && (!layer.roles || !Object.keys(layer.roles).length) && layer.mvt_cache);

    if (mvt_cache) {

      // Get MVT from cache table.
      var rows = await dbs[layer.dbs](`SELECT mvt FROM ${layer.mvt_cache} WHERE z = ${z} AND x = ${x} AND y = ${y}`);

      if (rows instanceof Error) return res.status(500).send('Failed to query PostGIS table.');

      // If found return the cached MVT to client.
      if (rows.length === 1) return res
        .type('application/x-protobuf')
        .code(200)
        .send(rows[0].mvt);

    }

    // Construct array of fields queried
    const mvt_fields = Object.values(layer.style.themes || {}).map(theme => theme.fieldfx && `${theme.fieldfx} AS ${theme.field}` || theme.field);

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
          ${r/4}
        )

        ${filter_sql}

    ) tile
    
    ${mvt_cache ? 'RETURNING mvt;' : ';'}`;

    rows = dbs[layer.dbs] && await dbs[layer.dbs](q);

    if (rows instanceof Error) return res.status(500).send('Failed to query PostGIS table.');

    // Return MVT to client.
    res.send(rows[0].mvt);

  }