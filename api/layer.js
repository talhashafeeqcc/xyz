const auth = require('../mod/auth/handler')({
  public: true
})

// const dbs = require('../mod/dbs')()

// const sql_filter = require('../mod/sql_filter')

const _layers = require('../mod/workspace/layers')

const format = {
  cluster: require('../mod/layer/cluster'),
  mvt: require('../mod/layer/mvt'),
  geojson: require('../mod/layer/geojson'),
  grid: ('../mod/layer/grid'),
}

module.exports = async (req, res) => {

  await auth(req, res)

  if (res.finished) return

  const layers = await _layers(req, res)

  if (req.query.clear_cache) return res.end()

  if (res.finished) return

  if (!req.params.layer || !req.params.format) return res.send('Help text.')

  req.params.layer = layers[req.params.layer]

  return format[req.params.format](req, res)

}