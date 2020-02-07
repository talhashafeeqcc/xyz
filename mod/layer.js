const getWorkspace = require('./workspace/get')

const workspace = getWorkspace()

module.exports = async (req, res) => {

  if (req.query.clear_cache) {
    Object.assign(workspace, getWorkspace())
    return res.end()
  }

  Object.assign(workspace, await workspace)

  const locale = workspace.locales[req.query.locale]

  const layer = locale.layers[req.query.layer]

  if (layer.roles && !Object.keys(layer.roles).some(
    role => req.params.token.roles && req.params.token.roles.includes(role)
  )) return res.status(400).send('Insufficient role priviliges.')

  req.params.layer = layer

}