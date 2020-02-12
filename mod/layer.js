const getWorkspace = require('./workspace/get')

let _workspace = getWorkspace()

module.exports = async (req, res) => {

  if (req.query.clear_cache) {
    _workspace = getWorkspace()
    return res.end()
  }

  const workspace = await _workspace

  const locale = workspace.locales[req.query.locale]

  const layer = locale.layers[req.query.layer]

  if (layer.roles && !Object.keys(layer.roles).some(
    role => req.params.token.roles && req.params.token.roles.includes(role)
  )) return res.status(400).send('Insufficient role priviliges.')

  req.params.layer = layer

}