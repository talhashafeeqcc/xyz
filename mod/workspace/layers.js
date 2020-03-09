let _workspace = require('./_workspace')()

const workspace = {}

module.exports = async (req, res) => {

  if (req.query.clear_cache) {
    _workspace = require('./_workspace')()
    return res.end()
  }

  //const t = process.hrtime()

  Object.assign(workspace, {}, await _workspace)

  //console.log(process.hrtime(t))

  if (!req.params.locale || !workspace.locales[req.params.locale]) return {}

  const locale = workspace.locales[req.params.locale]

  return locale.layers

}