const requestBearer = require('../mod/requestBearer')

const getWorkspace = require('../mod/workspace/get')

const workspace = getWorkspace()

const getTemplates = require('../mod/templates/_templates')

const templates = getTemplates(workspace)

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
  
  const html = templates[req.params.template].render({
    title: process.env.TITLE || 'GEOLYTIX | XYZ',
    dir: process.env.DIR || '',
    token: req.query.token || req.params.token.signed || '""',
  })

  //Build the template with jsrender and send to client.
  res.send(html)

}