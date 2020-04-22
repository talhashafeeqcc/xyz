const auth = require('../mod/auth/handler')

const _layers = require('../mod/workspace/layers')

const _format = {
  cluster: require('../mod/layer/cluster'),
  mvt: require('../mod/layer/mvt'),
  geojson: require('../mod/layer/geojson'),
  grid: ('../mod/layer/grid'),
}

module.exports = async (req, res) => {

  req.params = Object.assign(req.params || {}, req.query || {})

  await auth(req, res)

  if (res.finished) return

  const layers = await _layers(req)

  if (req.params.clear_cache) return res.end()

  const format = _format[req.params.format]

  if (!format) return res.send('Help text.')

  req.params.layer = layers[req.params.layer]

  if (!req.params.layer) return res.send('Help text.')

  return format(req, res)
}