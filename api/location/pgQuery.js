const requestBearer = require('../../mod/requestBearer')

const layer = require('../../mod/layer')

const dbs = require('../../mod/pg/dbs')()

//const fetch = require('node-fetch')

const provider = require('../../mod/provider');

module.exports = (req, res) => requestBearer(req, res, [ layer, handler ], {
	public: true
})

async function handler(req, res) {

	const layer = req.params.layer

	var query;

	if(decodeURIComponent(req.query.pgquery).toLowerCase().includes('api.github')) {

		query = await provider.github(decodeURIComponent(req.query.pgquery));
	
	} else {

		query = decodeURIComponent(req.query.pgquery);
	}

	console.log(query);
	console.log(req.query.id);

	const rows = await dbs[layer.dbs](query, [req.query.id])

	if (rows instanceof Error) return res.status(500).send('Failed to query PostGIS table.')

	res.send(rows)

}