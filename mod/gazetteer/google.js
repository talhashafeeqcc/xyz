const fetch = require('node-fetch')

module.exports = async (term, gazetteer) => {

  //https://developers.google.com/places/web-service/autocomplete

  // Create url decorated with gazetteer options.
  const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${term}`
    + `${gazetteer.code ? '&components=country:' + gazetteer.code : ''}`
    + `${gazetteer.bounds ? '&' + decodeURIComponent(gazetteer.bounds) : ''}`
    + `&${process.env.KEY_GOOGLE}`

  const fetched = await fetch(url)

  const google = await fetched.json()
   
  // Return results to route. Zero results will return an empty array.
  return await google.predictions.map(f => ({
    label: f.description,
    id: f.place_id,
    source: 'google'
  }))
}