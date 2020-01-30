const auth = require('../../../../mod/auth/handler')

const _workspace = require('../../../../mod/workspace/get')()

const dbs = require('../../../../mod/pg/dbs')()

const infoj_values = require('../../../../mod/infoj_values.js')

module.exports = (req, res) => auth(req, res, handler, {
	public: true
})

async function handler(req, res, token = {}) {

	const workspace = await _workspace

	const locale = workspace.locales[req.query.locale]

	const layer = locale.layers[req.query.layer]

	// // here
	// if (req.query.meta) meta_json = {
	// 	'Recent isoline': 'Here',
	// 	'Mode': req.body.mode || 'car',
	// 	'Range type': req.body.rangetype || 'time',
	// 	'Type': req.body.type || 'fastest',
	// 	'Range': req.body.minutes || req.body.distance,
	// 	'Created': date()
	// }

	// //mapbox
	// if (req.query.meta) meta_json = {
	// 	'Recent isoline': 'Mapbox',
	// 	'Mode': req.body.profile || 'driving',
	// 	'Minutes': req.body.minutes || 10,
	// 	'Created': date()
	// }

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
		roles: token.roles || []
	})

	if (rows instanceof Error) return res.status(500).send('Failed to query PostGIS table.')

	// return 204 if no record was returned from database.
	if (rows.length === 0) return res.status(202).send('No rows returned from table.')

	// Send the infoj object with values back to the client.
	res.send(rows[0])

}