const requestBearer = require('../../mod/requestBearer')

const layer = require('../../mod/layer')

const dbs = require('../../mod/pg/dbs')()

const fetch = require('node-fetch')

module.exports = (req, res) => requestBearer(req, res, [ layer, handler ], {
	public: true
})

async function handler(req, res) {

	const layer = req.params.layer

	const response = await fetch(
		req.query.pgquery,
		{ headers: new fetch.Headers({ Authorization: `Basic ${Buffer.from(process.env.KEY_GITHUB).toString('base64')}` }) })

	const b64 = await response.json()

	const buff = await Buffer.from(b64.content, 'base64')

	const query = await buff.toString('utf8')

	const rows = await dbs[layer.dbs](query, [req.query.id])

	if (rows instanceof Error) return res.status(500).send('Failed to query PostGIS table.')

	res.send(rows)

}