const fetch = require('node-fetch')

const { readFileSync } = require('fs');

const { join } = require('path');

const { Pool } = require('pg');

const assignDefaults = require('./assignDefaults')

const provider = require('../provider')

const getFrom = {
  'http': ref => http(ref),
  'https': ref => http(ref),
  'file': ref => file(ref.split(':')[1]),
  'github': ref => github(ref.split(':')[1]),
  'postgres': ref => postgres(ref),
}

let workspace = null

module.exports = async cache => {

  if (!workspace || cache) {

    workspace = await getFrom[process.env.WORKSPACE.split(':')[0]](process.env.WORKSPACE)

    if (workspace instanceof Error) return workspace

    workspace = await assignDefaults(workspace)

    await assignTemplates()
  }

  return workspace
}

async function http(ref){
  try {

    const response = await fetch(ref)

    if (response.status >= 300) return new Error(`${response.status} ${req}`)

    return await response.json()

  } catch(err) {

    return err

  }
}

function file(ref) {
  try {
    return JSON.parse(readFileSync(join(__dirname, `../../public/workspaces/${ref}`)), 'utf8')
  } catch (err) {
    console.error(err)
    return err
  }
}

async function github(ref){
  const response = await provider.github(ref)
  if (response instanceof Error) return response
  return JSON.parse(response)
}

async function postgres(ref) {

  const pool = new Pool({
    connectionString: ref.split('|')[0],
    statement_timeout: 10000
  })

  try {
    const { rows } = await pool.query(`SELECT * FROM ${ref.split('|')[1]} ORDER BY _id DESC LIMIT 1`)
    return rows[0].settings

  } catch(err) {
    console.error(err)
    return {}
  }
}

const _file = location => {
  const template = readFileSync(join(__dirname, location)).toString('utf8')

  return {
    template: template,
    render: params => template.replace(/\$\{(.*?)\}/g, matched => params[matched.replace(/\$|\{|\}/g, '')] || '')
  }
}

const templates = {

  //views
  _desktop: _file('../../public/views/_desktop.html'),
  _mobile: _file('../../public/views/_mobile.html'),
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

async function assignTemplates() {

  const templatePromises = Object.entries(workspace.templates || {}).map(
    entry => new Promise(resolve => {

      function _resolve(_template) {

        const template = {}

        template[entry[0]] = {}

        if (_template instanceof Error) {
          template[entry[0]].err = _template
          return resolve(template)
        }

        template[entry[0]].template = _template

        template[entry[0]].dbs = entry[1].dbs

        template[entry[0]].roles = entry[1].roles

        template[entry[0]].access = entry[1].access

        template[entry[0]].render = params => _template.replace(/\$\{(.*?)\}/g, matched => params[matched.replace(/\$|\{|\}/g, '')] || ''),

        resolve(template)
      }

      if (entry[1].template.toLowerCase().includes('api.github')) {
        return provider.github(entry[1].template).then(template => _resolve(template))
      }

      if (entry[1].template.startsWith('http')) {
        return provider.http(entry[1].template).then(template => _resolve(template))
      }

      return _resolve(entry[1].template)

    })
  )

  return new Promise((resolve, reject) => {

    Promise
      .all(templatePromises)
      .then(arr => {
        Object.assign(workspace.templates, templates, ...arr)
        resolve()
      })
      .catch(error => {
        console.error(error)
        reject()
      });

  })

}