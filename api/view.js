const requestBearer = require('../mod/requestBearer')

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
  
  const html = templates[req.params.template].render(Object.assign({
    title: process.env.TITLE || 'GEOLYTIX | XYZ',
    dir: process.env.DIR || '',
    token: req.query.token || req.params.token.signed || '""',
  }, req.query))

  //Build the template with jsrender and send to client.
  res.send(html)

}