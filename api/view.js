const auth = require('../mod/auth/handler')({
  public: true,
  login: true
})

const _templates = require('../mod/workspace/templates')

let templates

module.exports = async (req, res) => {

  await auth(req, res)

  templates = await _templates(req, res)

  if (res.finished) return

  const template = templates[decodeURIComponent(req.params.template)]

  if (!template) return res.status(400).send('View template not found.')

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