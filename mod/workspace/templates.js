const provider = require('../provider')

const getWorkspace = require('./getWorkspace')

let _workspace = getWorkspace()

const { readFileSync } = require('fs');

const { join } = require('path');

const _file = location => ({
    render: params => readFileSync(join(__dirname, location))
      .toString('utf8')
      .replace(/\$\{(.*?)\}/g, matched => params[matched.replace(/\$|\{|\}/g, '')] || '')
})

const templates = {

  //views
  _desktop: _file('../../public/views/_desktop.html'),
  _mobile: _file('../../public/views/_mobile.html'),
  _login: _file('../../public/views/_login.html'),
  _register: _file('../../public/views/_register.html'),
  admin_user: _file('../../public/views/_admin_user.html'),
  admin_workspace: _file('../../public/views/_admin_workspace.html'),

  //queries
  mvt_cache: require('../../public/queries/mvt_cache'),
  get_nnearest: require('../../public/queries/get_nnearest'),
  field_stats: require('../../public/queries/field_stats'),
  infotip: require('../../public/queries/infotip'),
  count_locations: require('../../public/queries/count_locations'),
  labels: require('../../public/queries/labels'),
  layer_extent: require('../../public/queries/layer_extent'),
  set_field_array: require('../../public/queries/set_field_array'),
  filter_aggregate: require('../../public/queries/filter_aggregate'),
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