const auth = require('../../../mod/auth/handler')({
  public: true
})

const dbs = require('../../../mod/pg/dbs')()

const _layers = require('../../../mod/workspace/layers')

const infoj_values = require('../../../mod/infoj_values.js')

module.exports = async (req, res) => {

  await auth(req, res)

  const layers = await _layers(req, res)

  if (res.finished) return

  const layer = layers[req.params.layer]

	var q = `
    UPDATE ${req.params.table}
    SET ${req.params.field} = ST_Transform(ST_SetSRID(ST_GeomFromGeoJSON('${JSON.stringify(req.body.isoline)}'), 4326), ${layer.srid})
    WHERE ${layer.qID} = $1;`

	var rows = await dbs[layer.dbs](q, [req.params.id])

	if (rows instanceof Error) return res.status(500).send('Failed to update PostGIS table.')

	var rows = await infoj_values({
		locale: req.params.locale,
		layer: layer,
		table: req.params.table,
		id: req.params.id,
		roles: req.params.token.roles || []
	})

	if (rows instanceof Error) return res.status(500).send('Failed to query PostGIS table.')

	// return 204 if no record was returned from database.
	if (rows.length === 0) return res.status(202).send('No rows returned from table.')

	// Send the infoj object with values back to the client.
	res.send(rows[0])

}