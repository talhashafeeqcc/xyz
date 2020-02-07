const fetch = require('node-fetch')

const requestBearer = require('../../../../mod/requestBearer')

module.exports = (req, res) => requestBearer(req, res, [ handler ], {
  public: true
})

async function handler(req, res) {

  const params = {
    coordinates: req.query.coordinates,
    minutes: req.query.minutes || 10,
    profile: req.query.profile || 'driving'
  }

  let mapbox_isolines

  try {
    const response = await fetch(`https://api.mapbox.com/isochrone/v1/mapbox/${params.profile}/${params.coordinates}?contours_minutes=${params.minutes}&generalize=${params.minutes}&polygons=true&${process.env.KEY_MAPBOX}`)
    mapbox_isolines = await response.json()

  } catch (err) {

    res.status(500).send(err)
  }

  if (!mapbox_isolines.features) return res.status(202).send({
    msg: 'No catchment found within this time frame.',
    res: mapbox_isolines
  })

  return res.send(mapbox_isolines.features[0].geometry)

}