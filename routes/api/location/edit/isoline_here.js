const env = require('../../../../mod/env');

const fetch = require('node-fetch');

module.exports = fastify => {

  fastify.route({
    method: 'GET',
    url: '/api/location/edit/isoline/here',
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
          coordinates: { type: 'string' },
        },
        required: ['coordinates']
      }
    },
    preHandler: [
      fastify.evalParam.token
    ],
    handler: async (req, res) => {

      const params = {
        coordinates: req.query.coordinates,
        mode: req.query.mode || 'car',
        type: req.query.type || 'fastest', //'shortest'
        rangetype: req.query.rangetype || 'time',
        traffic: 'traffic:disabled'
      };

      params.range = params.rangetype === 'time' ?
        (req.query.minutes || 10) * 60 || 600 :
        params.rangetype === 'distance' ?
          (req.query.distance || 1) * 1000 || 1000 :
          600;

      let here_isolines;
      
      try {
        const response = await fetch(`https://isoline.route.api.here.com/routing/7.2/calculateisoline.json?${process.env.KEY_HERE}&mode=${params.type};${params.mode};${params.traffic}&start=geo!${params.coordinates}&range=${params.range}&rangetype=${params.rangetype}`);
        here_isolines = await response.json();
        
      } catch (err) {
    
        res.code(500).send(err);
      }


      if (!here_isolines.response
        || !here_isolines.response.isoline
        || !here_isolines.response.isoline[0].component) return res.code(202).send({
        'msg': 'No isoline found within this range.',
        'res': here_isolines
      });

      const geojson = {
        'type': 'Polygon',
        'coordinates': [[]]
      };

      here_isolines.response
        .isoline[0].component[0].shape.forEach(el => {
          el = el.split(',');
          geojson.coordinates[0].push(el.reverse());
        });
     
      return res.code(200).send(geojson);

    }

  });
};