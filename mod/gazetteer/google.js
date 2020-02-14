const provider = require('../provider')

module.exports = async (term, gazetteer) => {

  //https://developers.google.com/places/web-service/autocomplete

  // Create url decorated with gazetteer options.
  const results = await provider.google(`maps.googleapis.com/maps/api/place/autocomplete/json?input=${term}`
    + `${gazetteer.code ? '&components=country:' + gazetteer.code : ''}`
    + `${gazetteer.bounds ? '&' + decodeURIComponent(gazetteer.bounds) : ''}`)
  
  // Return results to route. Zero results will return an empty array.
  return results.predictions.map(f => ({
    label: f.description,
    id: f.place_id,
    source: 'google'
  }))
}