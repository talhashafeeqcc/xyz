const auth = require('../mod/auth/handler')

const _method = {
  cache: {
    handler: cache,
    access: 'admin_workspace'
  },
  set: {
    handler: set,
    access: 'admin_workspace'
  },
  get: {
    handler: get
  }
}

const getWorkspace = require('../mod/workspace/getWorkspace')

let _workspace = getWorkspace()

const { Pool } = require('pg')

const fetch = require('node-fetch')

const _layers = require('../mod/workspace/layers')

const _templates = require('../mod/workspace/templates')

module.exports = async (req, res) => {

  req.params = Object.assign(req.params || {}, req.query || {})

  const method = _method[req.params && req.params.method]

  if (!method) return res.send('Help text.')

  await auth(req, res, method.access)

  if (res.finished) return

  method.handler(req, res)
}

async function cache(req, res) {

  _workspace = getWorkspace()

  const host = `${req.headers.host.includes('localhost') && 'http' || 'https'}://${req.headers.host}${process.env.DIR || ''}`

  Promise.all([
    fetch(`${host}/view?clear_cache=true&token=${req.params.token.signed}`),
    fetch(`${host}/api/query?clear_cache=true&token=${req.params.token.signed}`),
    fetch(`${host}/api/gazetteer?clear_cache=true&token=${req.params.token.signed}`),
    fetch(`${host}/api/layer?clear_cache=true&token=${req.params.token.signed}`),
    fetch(`${host}/api/location?clear_cache=true&token=${req.params.token.signed}`),
  ]).then(arr => {
    console.log(arr)
    if (arr.some(response => !response.ok)) return res.status(500).send('Failed to cache workspace.')
    res.send('Workspace cached.')
  })
}

async function get(req, res) {

  const workspace = await _workspace

  const layers = await _layers(req, res)

  const templates = await _templates(req, res)

  if (req.params.key === 'layer' && req.params.layer) return res.send(layers[req.params.layer])

  if (req.params.key === 'layers') return res.send(Object.keys(layers))

  if (req.params.key === 'template' && req.params.template) return res.send(templates[req.params.template])

  if (req.params.key === 'templates') return res.send(Object.keys(workspace.templates))

  if (req.params.key === 'locale' && req.params.locale) {

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

  if (!req.params.key) return res.send(workspace)

  res.send('Help text.')
}

async function set(req, res) {

  try {

    const pool = new Pool({
      connectionString: process.env.WORKSPACE.split('|')[0],
      statement_timeout: 10000
    })

    await pool.query(`
      INSERT INTO ${process.env.WORKSPACE.split('|')[1]} (settings)
      SELECT $1 AS settings;`, [req.body]);

    return res.send('PostgreSQL Workspace updated.')

  } catch (err) {

    console.error(err)
    return res.status(500).send('FAILED to update PostgreSQL Workspace table.')
  }
}