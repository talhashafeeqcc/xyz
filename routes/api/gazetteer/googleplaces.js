const env = require('../../../mod/env');

const fetch = require('node-fetch');

module.exports = fastify => {
  fastify.route({
    method: 'GET',
    url: '/api/gazetteer/googleplaces',
    preValidation: fastify.auth([
      (req, res, next) => fastify.authToken(req, res, next, {
        public: true
      })
    ]),
    preHandler: [
      fastify.evalParam.token,
    ],
    handler: async (req, res) => {

      let fetched;
      
      try {
        const response = await fetch(`https://maps.googleapis.com/maps/api/place/details/json?placeid=${req.query.id}&${env.keys.GOOGLE}`);
        fetched = await response.json();
        
      } catch (err) {
    
        res.code(500).send(err);
      }

      res.code(200).send({
        type: 'Point',
        coordinates: [fetched.result.geometry.location.lng, fetched.result.geometry.location.lat]
      });

    }
  });
};