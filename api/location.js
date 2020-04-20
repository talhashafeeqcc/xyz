const auth = require('../mod/auth/handler')({
  public: true
})

// const dbs = require('../mod/dbs')()

// const sql_filter = require('../mod/sql_filter')

const _layers = require('../mod/workspace/layers')

const _method = {
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

  const method = _method[req.params.method]

  if (!method) return res.send('Help text.')

  req.params.layer = layers[req.params.layer]

  if (!req.params.layer) return res.send('Help text.')
  
  return method(req, res)
}
