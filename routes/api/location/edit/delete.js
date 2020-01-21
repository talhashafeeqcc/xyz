const env = require('../../../../mod/env');

module.exports = fastify => {

  fastify.route({
    method: 'GET',
    url: '/api/location/edit/delete',
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
          filter: { type: 'string' },
        },
        required: ['locale', 'layer', 'table']
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
        qID = layer.qID,
        id = req.query.id;

      if (layer.mvt_cache) {
        
        var q = `
        DELETE FROM ${layer.mvt_cache} 
        WHERE
          ST_Intersects(
            tile, 
            (SELECT ${layer.geom} FROM ${table} WHERE ${layer.qID} = $1)
          );`;
      
        await env.dbs[layer.dbs](q, [id]);

      }

      var q = `DELETE FROM ${table} WHERE ${qID} = $1;`;

      var rows = await env.dbs[layer.dbs](q, [id]);

      if (rows instanceof Error) return res.code(500).send('PostgreSQL query error - please check backend logs.');

      res.code(200).send('Location delete successful');

    }

  });
};