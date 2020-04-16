const auth = require('../../mod/auth/handler')({
  public: true
})

let _workspace = require('../../mod/workspace/_workspace')()

const fetch = require('node-fetch')

const _layers = require('../../mod/workspace/layers')

const _templates = require('../../mod/workspace/templates')

module.exports = async (req, res) => {

  await auth(req, res)

  if (res.finished) return

  if (req.query.clear_cache) {

    _workspace = require('../../mod/workspace/_workspace')()

    const response = await clearcache(`${req.headers.host.includes('localhost') && 'http' || 'https'}://${req.headers.host}${process.env.DIR || ''}`, req.params.token.signed)

    console.log(response)
  }

  const workspace = await _workspace

  const layers = await _layers(req, res)

  const templates = await _templates(req, res)

  if (req.params.key === 'layers' && req.params.layer) return res.send(layers[req.params.layer])

  if (req.params.key === 'layers') return res.send(Object.keys(layers))

  if (req.params.key === 'templates' && req.params.template) return res.send(templates[req.params.template])

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

function clearcache(host, token) {

  return new Promise(resolve => {

    Promise.all([
      fetch(`${host}?clear_cache=true&token=${token || ''}`),
      fetch(`${host}/view/foo?clear_cache=true&token=${token || ''}`),
      fetch(`${host}/query?clear_cache=true&token=${token || ''}`),
      fetch(`${host}/api/gazetteer?clear_cache=true&token=${token || ''}`),
      fetch(`${host}/api/layer/mvt?clear_cache=true&token=${token || ''}`),
      fetch(`${host}/api/layer/cluster?clear_cache=true&token=${token || ''}`),
      fetch(`${host}/api/layer/grid?clear_cache=true&token=${token || ''}`),
      fetch(`${host}/api/layer/geojson?clear_cache=true&token=${token || ''}`),
      fetch(`${host}/api/location/get?clear_cache=true&token=${token || ''}`),
      fetch(`${host}/api/location/new?clear_cache=true&token=${token || ''}`),
      fetch(`${host}/api/location/update?clear_cache=true&token=${token || ''}`),
      fetch(`${host}/api/location/delete?clear_cache=true&token=${token || ''}`)
    ]).then(arr => {
      //console.log(arr)
      resolve(Object.assign(...arr))
    })

  })
}