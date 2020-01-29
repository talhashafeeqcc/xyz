const fetch = require('node-fetch')

module.exports = async (term, gazetteer) => {

	const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(term)}`
		+ `${gazetteer.code ? `&countrycode=${gazetteer.code}` : ''}`
		+ `${gazetteer.bounds ? '&bounds=' + decodeURIComponent(gazetteer.bounds) : ''}`
		+ `&key=${process.env.KEY_OPENCAGE}`;

	const fetched = await fetch(url)

	const opencage = await fetched.json()

	return await opencage.results.map(f => ({
		id: f.annotations.geohash,
		label: f.formatted,
		marker: [f.geometry.lng, f.geometry.lat],
		source: 'opencage'
	}))
}