const requestBearer = require('../mod/requestBearer')

const Md = require('mobile-detect')

const getWorkspace = require('../mod/workspace/get')

const workspace = getWorkspace()

const getTemplates = require('../mod/templates/_templates')

const templates = getViews(workspace)

module.exports = (req, res) => requestBearer(req, res, [ handler ], {
  public: true,
  login: true
})

async function handler(req, res){

  if (req.query.clear_cache) {
    Object.assign(workspace, getWorkspace())
    Object.assign(templates, getTemplates(workspace))
    return res.end()
  }

  Object.assign(workspace, await workspace)
  Object.assign(templates, await templates)

  const md = new Md(req.headers['user-agent'])

  const template = templates[(md.mobile() === null || md.tablet() !== null) && 'desktop' || 'mobile'];
  
  const html = template.render({
    dir: process.env.DIR || '',
    title: process.env.TITLE || 'GEOLYTIX | XYZ',
    token: req.query.token || req.params.token.signed || '""',
    log: process.env.LOG_LEVEL || '""',
    login: (process.env.PRIVATE || process.env.PUBLIC) && 'true' || '""',
  })

  res.send(html)

}