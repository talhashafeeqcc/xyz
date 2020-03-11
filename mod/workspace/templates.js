const provider = require('../provider')

let _workspace = require('./_workspace')()

const workspace = {}

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
}

module.exports = async (req, res) => {

  if (req.query.clear_cache) {
    _workspace = require('./_workspace')()
    return res.end()
  }

  Object.assign(workspace, {}, await _workspace)

  for (key of Object.keys(workspace.templates || {})) {

    const template = workspace.templates[key].template.toLowerCase().includes('api.github') && await provider.github(workspace.templates[key].template)
      || workspace.templates[key].template.startsWith('http') && await provider.http(workspace.templates[key].template)
      || workspace.templates[key].template

    templates[key] = {
      render: params => template.replace(/\$\{(.*?)\}/g, matched => params[matched.replace(/\$|\{|\}/g, '')] || ''),
      dbs: workspace.templates[key].dbs || null,
      roles: workspace.templates[key].roles || null,
      admin_workspace: workspace.templates[key].admin_workspace || null,
      admin_user: workspace.templates[key].admin_user || null,
      template: template
    }

  }

  return templates

}