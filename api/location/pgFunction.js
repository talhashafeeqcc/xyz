const requestBearer = require('../../mod/requestBearer')

const layer = require('../../mod/layer')

const dbs = require('../../mod/pg/dbs')()

module.exports = (req, res) => requestBearer(req, res, [ layer, handler ], {
	public: true
})

async function handler(req, res) {

	const layer = req.params.layer

	const entry = layer.infoj.find(entry => entry.pgFunction === decodeURIComponent(req.query.pgFunction))

	const q = `SELECT * FROM ${entry.pgFunction}($1);`

	const rows = await dbs[layer.dbs](q, [req.query.id])

	if (rows instanceof Error) return res.status(500).send('Failed to query PostGIS table.')

	res.send(rows)

}