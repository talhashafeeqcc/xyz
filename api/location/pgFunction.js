const auth = require('../../mod/auth/handler')

const getWorkspace = require('../../mod/workspace/get')

const workspace = getWorkspace()

const dbs = require('../../mod/pg/dbs')()

module.exports = (req, res) => auth(req, res, handler, {
	public: true
})

async function handler(req, res, token = {}) {

  if (req.query.clear_cache) {
    Object.assign(workspace, getWorkspace())
    return res.end()
  }

  Object.assign(workspace, await workspace)

	const locale = workspace.locales[req.query.locale]

	const layer = locale.layers[req.query.layer]

	const entry = layer.infoj.find(entry => entry.pgFunction === decodeURIComponent(req.query.pgFunction))

	const q = `SELECT * FROM ${entry.pgFunction}($1);`

	const rows = await dbs[layer.dbs](q, [req.query.id])

	if (rows instanceof Error) return res.status(500).send('Failed to query PostGIS table.')

	res.send(rows)

}