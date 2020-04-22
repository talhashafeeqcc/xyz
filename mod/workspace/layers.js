const getWorkspace = require('./getWorkspace')

let _workspace = getWorkspace()

module.exports = async req => {

  if (req.params.clear_cache) {
    _workspace = getWorkspace()
    return
  }

  //const t = process.hrtime()

  const workspace = await _workspace

  //console.log(process.hrtime(t))

  if (!req.params.locale || !workspace.locales[req.params.locale]) return {}

  const locale = workspace.locales[req.params.locale]

  return locale.layers
}