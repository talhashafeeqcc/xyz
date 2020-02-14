const provider = require('../provider')

module.exports = async (term, gazetteer) => {

	const results = await provider.opencage(`api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(term)}`
		+ `${gazetteer.code ? `&countrycode=${gazetteer.code}` : ''}`
		+ `${gazetteer.bounds ? '&bounds=' + decodeURIComponent(gazetteer.bounds) : ''}`)

	return results.results.map(f => ({
		id: f.annotations.geohash,
		label: f.formatted,
		marker: [f.geometry.lng, f.geometry.lat],
		source: 'opencage'
	}))
}