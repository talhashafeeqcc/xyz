const requestBearer = require('../../../mod/requestBearer')

const layer = require('../../../mod/layer')

const dbs = require('../../../mod/pg/dbs')()

const infoj_values = require('../../../mod/infoj_values.js')

module.exports = (req, res) => requestBearer(req, res, [ layer, handler ], {
	public: true
})

async function handler(req, res) {

	const layer = req.params.layer

	var q = `
    UPDATE ${req.query.table}
    SET ${req.query.field} = ST_Transform(ST_SetSRID(ST_GeomFromGeoJSON('${JSON.stringify(req.body.isoline)}'), 4326), ${layer.srid})
    WHERE ${layer.qID} = $1;`

	var rows = await dbs[layer.dbs](q, [req.query.id])

	if (rows instanceof Error) return res.status(500).send('Failed to update PostGIS table.')

	var rows = await infoj_values({
		locale: req.query.locale,
		layer: layer,
		table: req.query.table,
		id: req.query.id,
		roles: req.params.token.roles || []
	})

	if (rows instanceof Error) return res.status(500).send('Failed to query PostGIS table.')

	// return 204 if no record was returned from database.
	if (rows.length === 0) return res.status(202).send('No rows returned from table.')

	// Send the infoj object with values back to the client.
	res.send(rows[0])

}