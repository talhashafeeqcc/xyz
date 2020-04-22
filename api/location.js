const auth = require('../mod/auth/handler')

const _layers = require('../mod/workspace/layers')

const _method = {
  new: require('../mod/location/new'),
  get: require('../mod/location/get'),
  update: require('../mod/location/update'),
  delete: require('../mod/location/delete'),
}

module.exports = async (req, res) => {

  req.params = Object.assign(req.params || {}, req.query || {})

  await auth(req, res)

  if (res.finished) return

  const layers = await _layers(req, res)

  if (req.params.clear_cache) return res.end()

  const method = _method[req.params.method]

  if (!method) return res.send('Help text.')

  req.params.layer = layers[req.params.layer]

  if (!req.params.layer) return res.send('Help text.')
  
  return method(req, res)
}
