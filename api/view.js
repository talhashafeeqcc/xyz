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

  console.log(req.params.template);

  const templates = await _templates

  const template = templates[req.params.template];

  console.log(template);

  const token = req.params.token || {};

  const login = () => templates._login.render({
    dir: process.env.DIR || '',
    action: req.url && decodeURIComponent(req.url),
    msg: '',
    captcha: process.env.GOOGLE_CAPTCHA && process.env.GOOGLE_CAPTCHA.split('|')[0] || '',
  })

  if (template.admin_user && !token.admin_user) return res.send(login())

  if (template.admin_workspace && !token.admin_workspace) return res.send(login())

  const html = template.render(Object.assign({
    title: process.env.TITLE || 'GEOLYTIX | XYZ',
    dir: process.env.DIR || '',
    token: req.query.token || req.params.token.signed || '""',
  }, req.query))

  //Build the template with jsrender and send to client.
  res.send(html)

}