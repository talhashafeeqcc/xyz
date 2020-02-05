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

  const q = locale.queries[req.query.q]

  var rows = await dbs[req.query.dbs](q, [req.body], 20000)

  if (rows instanceof Error) return res.status(500).send('Failed to query PostGIS table.')

  // Send the infoj object with values back to the client.
  res.send(rows[0])

}