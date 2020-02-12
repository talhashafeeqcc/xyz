const requestBearer = require('../mod/requestBearer')

const Md = require('mobile-detect')

const getWorkspace = require('../mod/workspace/get')

let workspace = getWorkspace()

const getTemplates = require('../mod/templates/_templates')

let _templates = getTemplates(workspace)

module.exports = (req, res) => requestBearer(req, res, [ handler ], {
  public: true,
  login: true
})

async function handler(req, res){

  if (req.query.clear_cache) {
    workspace = getWorkspace()
    _templates = getTemplates(workspace)
    return res.end()
  }

  const templates = await _templates

  const md = new Md(req.headers['user-agent'])

  const template = templates[(md.mobile() === null || md.tablet() !== null) && '_desktop' || '_mobile'];
  
  const html = template.render({
    dir: process.env.DIR || '',
    title: process.env.TITLE || 'GEOLYTIX | XYZ',
    token: req.query.token || req.params.token.signed || '""',
    log: process.env.LOG_LEVEL || '""',
    login: (process.env.PRIVATE || process.env.PUBLIC) && 'true' || '""',
  })

  res.send(html)

}