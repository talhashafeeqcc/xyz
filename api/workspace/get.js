const auth = require('../../mod/auth/handler')({
  public: true
})

let _workspace = require('../../mod/workspace/_workspace')()

const workspace = {}

const clearCache = require('../../mod/workspace/clearCache')

module.exports = async (req, res) => {

  await auth(req, res)

  Object.assign(workspace, {}, await _workspace)

  const newWorkspace = await require('../../mod/workspace/_workspace')()

  if (JSON.stringify(workspace) !== JSON.stringify(newWorkspace)) {
    await clearCache(`${req.headers.host.includes('localhost') && 'http' || 'https'}://${req.headers.host}`, req.params.token.signed)
    _workspace = require('../../mod/workspace/_workspace')()
    Object.assign(workspace, {}, newWorkspace)
  }

  if (req.params.key === 'templates' && req.params.template) return res.send(workspace.templates[req.params.template])

  if (req.params.key === 'templates') return res.send(Object.keys(workspace.templates))

  if (req.params.key === 'locales' && req.params.locale) {

    const locales = JSON.parse(JSON.stringify(workspace.locales));

    (function objectEval(o, parent, key) {
  
      // check whether the object has an access key matching the current level.
      if (Object.entries(o).some(
        e => e[0] === 'roles' && !Object.keys(e[1]).some(
          role => req.params.token.roles && req.params.token.roles.includes(role)
        )
      )) {
  
        // if the parent is an array splice the key index.
        if (parent.length > 0) return parent.splice(parseInt(key), 1)
  
        // if the parent is an object delete the key from the parent.
        return delete parent[key]
      }
  
      // iterate through the object tree.
      Object.keys(o).forEach((key) => {
        if (o[key] && typeof o[key] === 'object') objectEval(o[key], o, key)
      });
  
    })(locales)

    return res.send(locales[req.params.locale] || {})
  }

  if (req.params.key === 'locales') return res.send(Object.keys(workspace.locales))

  res.send(workspace)
 
}