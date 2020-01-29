const fetch = require('node-fetch');

const auth = require('../../mod/auth/handler')

module.exports = (req, res) => auth(req, res, handler, {
  public: true
})

async function handler(req, res, token = {}) {

  const response = await fetch(`https://maps.googleapis.com/maps/api/place/details/json?placeid=${req.query.id}&${process.env.KEY_GOOGLE}`);
  const fetched = await response.json();

  res.send({
    type: 'Point',
    coordinates: [fetched.result.geometry.location.lng, fetched.result.geometry.location.lat]
  });

}