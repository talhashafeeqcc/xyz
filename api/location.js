const auth = require('../mod/auth/handler')({
  public: true
})

// const dbs = require('../mod/dbs')()

// const sql_filter = require('../mod/sql_filter')

const _layers = require('../mod/workspace/layers')

const method = {
  new: require('../mod/location/new'),
  get: require('../mod/location/get'),
  update: require('../mod/location/update'),
  delete: ('../mod/location/delete'),
}

module.exports = async (req, res) => {

  await auth(req, res)

  if (res.finished) return

  const layers = await _layers(req, res)

  if (req.query.clear_cache) return res.end()

  if (res.finished) return

  if (!req.params.layer || !req.params.method) return res.send('Help text.')

  req.params.layer = layers[req.params.layer]

  return method[req.params.method](req, res)

}