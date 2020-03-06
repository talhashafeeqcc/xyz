const getWorkspace = require('./get')

let _workspace = getWorkspace()

module.exports = async (req, res) => {

  if (req.query.clear_cache) {
    _workspace = getWorkspace()
    return res.end()
  }

  const workspace = await _workspace

  if (!req.query.locale) return []

  const locale = workspace.locales[req.query.locale]

  return locale.layers

}