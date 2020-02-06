const auth = require('../../mod/auth/handler')

const getWorkspace = require('../../mod/workspace/get')

const workspace = getWorkspace()

const dbs = require('../../mod/pg/dbs')()

const fetch = require('node-fetch')

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

	var query;

	if(req.query.pgquery.toLowerCase().includes('api.github')) {

		const response = await fetch(
			req.query.pgquery,
			{ headers: new fetch.Headers({ Authorization: `Basic ${Buffer.from(process.env.KEY_GITHUB).toString('base64')}` }) })

		const b64 = await response.json()

		const buff = await Buffer.from(b64.content, 'base64')

		query = await buff.toString('utf8')
	
	} else {

		query = req.query.pgquery;
	}

	const rows = await dbs[layer.dbs](query, [req.query.id])

	if (rows instanceof Error) return res.status(500).send('Failed to query PostGIS table.')

	res.send(rows)

}