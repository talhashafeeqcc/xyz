const fetch = require('node-fetch')

const requestBearer = require('../../mod/requestBearer')

module.exports = (req, res) => requestBearer(req, res, [ handler ], {
  public: true
})

async function handler(req, res) {

  const response = await fetch(`https://maps.googleapis.com/maps/api/place/details/json?placeid=${req.query.id}&${process.env.KEY_GOOGLE}`)
  const fetched = await response.json()

  res.send({
    type: 'Point',
    coordinates: [fetched.result.geometry.location.lng, fetched.result.geometry.location.lat]
  })

}