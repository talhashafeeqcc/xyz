const requestBearer = require('../../mod/requestBearer');

const getWorkspace = require('../../mod/workspace/get')

let workspace = getWorkspace()

const getTemplates = require('../../mod/templates/_templates')

let _templates = getTemplates(workspace)

module.exports = (req, res) => requestBearer(req, res, [ handler ], {
  admin_user: true,
  login: true
});

async function handler(req, res){

  if (req.query.clear_cache) {
    workspace = getWorkspace()
    _templates = getTemplates(workspace)
    return res.end()
  }

  const templates = await _templates

  const html = templates._admin_user.render({
    dir: process.env.DIR || '',
    token: req.params.token.signed
  })

  res.send(html)

}