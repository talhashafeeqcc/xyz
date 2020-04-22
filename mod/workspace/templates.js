const provider = require('../provider')

const getWorkspace = require('./getWorkspace')

let _workspace = getWorkspace()

const templates = {

  //views
  _desktop: require('./views/desktop'),
  _mobile: require('./views/mobile'),
  _login: require('./views/login'),
  _register: require('./views/register'),
  admin_user: require('./views/admin_user'),
  admin_workspace: require('./views/admin_workspace'),

  //queries
  mvt_cache: require('./queries/mvt_cache'),
  get_nnearest: require('./queries/get_nnearest'),
  field_stats: require('./queries/field_stats'),
  infotip: require('./queries/infotip'),
  count_locations: require('./queries/count_locations'),
  labels: require('./queries/labels'),
  layer_extent: require('./queries/layer_extent'),
  set_field_array: require('./queries/set_field_array'),
  filter_aggregate: require('./queries/filter_aggregate'),
}

const promises = []

module.exports = async req => {

  if (req.params.clear_cache) {
    _workspace = getWorkspace()
    Object.assign(promises, [])
    return
  }

  const workspace = await _workspace

  !promises.length && Object.assign(promises, Object.entries(workspace.templates || {}).map(
    entry => new Promise(resolve => {

      function _resolve(template) {
        resolve({
          [entry[0]]: {
            render: params => template.replace(/\$\{(.*?)\}/g, matched => params[matched.replace(/\$|\{|\}/g, '')] || ''),
            dbs: entry[1].dbs || null,
            roles: entry[1].roles || null,
            access: entry[1].access || null,
            template: entry[1].template,
            err: template.err || null,
          }
        })
      }

      if (entry[1].template.toLowerCase().includes('api.github')) return provider.github(entry[1].template)
        .then(template => _resolve(template))

      if (entry[1].template.startsWith('http')) return provider.http(entry[1].template)
        .then(template => _resolve(template))

      return _resolve(entry[1].template)

    })
  ))

  return new Promise(resolve => {

    Promise.all(promises).then(arr => {
      resolve(Object.assign(templates, ...arr))
    })

  })

}