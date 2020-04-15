const provider = require('../provider')

let _workspace = require('./_workspace')()

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
  user_list: require('./queries/user_list'),
  user_log: require('./queries/user_log'),
  set_field_array: require('./queries/set_field_array'),
  filter_aggregate: require('./queries/filter_aggregate'),
}

const promises = []

module.exports = async (req, res) => {

  if (req.query.clear_cache) {
    _workspace = require('./_workspace')()
    Object.assign(promises, [])
    return //res.end()
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
            admin_workspace: entry[1].admin_workspace || null,
            admin_user: entry[1].admin_user || null,
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

    Promise.all(promises).then(arr => resolve(Object.assign(templates, ...arr)))

  })

}