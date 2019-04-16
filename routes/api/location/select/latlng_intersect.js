const env = require(global.__approot + '/mod/env');

module.exports = fastify => {
  fastify.route({
    method: 'GET',
    url: '/api/location/select/latlng/intersects',
    preValidation: fastify.auth([
      (req, res, next) => fastify.authToken(req, res, next, {
        public: true
      })
    ]),
    schema: {
      querystring: {
        type: 'object',
        properties: {
          token: { type: 'string' },
          locale: { type: 'string' },
          layer: { type: 'string' },
          table: { type: 'string' },
          nnearest: { type: 'integer' },
          lat: { type: 'number' },
          lng: { type: 'number' },
          filter: { type: 'string' },
        },
        required: ['locale', 'layer', 'table', 'lat', 'lng']
      }
    },
    preHandler: [
      fastify.evalParam.token,
      fastify.evalParam.locale,
      fastify.evalParam.layer,
      fastify.evalParam.roles,
      fastify.evalParam.geomTable,
    ],
    handler: async (req, res) => {

      let
        layer = req.params.layer,
        table = req.query.table,
        lat = req.query.lat,
        lng = req.query.lng,
        infoj = JSON.parse(JSON.stringify(layer.infoj)),
        geom = req.query.geom || layer.geom;

      // Return 406 if table does not have EPSG:4326 geometry field.
      if (!geom) return res.code(400).send(new Error('Missing geom (SRID 4326) field on layer.'));
  

      // The fields array stores all fields to be queried for the location info.
      const fields = await require(global.__approot + '/mod/pg/sql_fields')([], infoj);

      // Push JSON geometry field into fields array.
      fields.push(`\n   ST_asGeoJson(${geom}) AS geomj`);
  
      var q = `
        WITH T AS (
            SELECT
            ${geom} AS _geom
            FROM ${table}
            WHERE ST_Contains(${geom}, ST_SetSRID(ST_Point(${lng}, ${lat}), 4326))
            LIMIT 1
        )
        SELECT ${fields.join()} FROM ${table}, T
        WHERE ST_Intersects(${geom}, _geom);`;
  
      var rows = await env.pg.dbs[layer.dbs](q);
  
      if (rows.err) return res.code(500).send('Failed to query PostGIS table.');

      // return 204 if no record was returned from database.
      if (rows.length === 0) return res.code(202).send('No rows returned from table.');
  
      // Iterate through the rows whereas each row is one location.
      rows.forEach(row => {

        // Iterate through infoj entries and assign values returned from query.
        infoj.forEach(entry =>  {
          if (row[entry.field]) entry.value = row[entry.field];
        });
        
      });
          
      // Send the infoj object with values back to the client.
      res.code(200).send(rows);

    }
  });
};