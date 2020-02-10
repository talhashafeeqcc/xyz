const fetch = require('node-fetch')

module.exports = async params => {

	const response = await fetch(
		
		params.uri,
		
		{ 
			headers: new fetch.Headers({
			 Authorization: `token ${process.env.KEY_GITHUB}`}) 
		})

	const b64 = await response.json()

	const buff = await Buffer.from(b64.content, 'base64')

	const content = await buff.toString('utf8');

	return content
}