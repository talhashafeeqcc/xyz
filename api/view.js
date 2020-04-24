const auth = require('../mod/auth/handler')

const Md = require('mobile-detect')

const _templates = require('../mod/workspace/templates')

module.exports = async (req, res) => {

  req.params = Object.assign(req.params || {}, req.query || {})

  const templates = await _templates(req)

  if (req.params.clear_cache) return res.end()

  const md = new Md(req.headers['user-agent'])

  req.params.template = req.params.template || (md.mobile() === null || md.tablet() !== null) && '_desktop' || '_mobile'

  const template = templates[req.params.template]

  if (!template) return res.status(404).send('View template not found.')

  if (template.err) return res.status(500).send(template.err)

  const access = template.access || req.params.access
   
  if (access === 'logout') {
    res.setHeader('Set-Cookie', `XYZ ${process.env.COOKIE || process.env.TITLE || 'token'}=null;HttpOnly;Max-Age=0;Path=${process.env.DIR || '/'}`)
    return res.send('Logged out.')
  }

  await auth(req, res, access)

  if (res.finished) return

  const html = template.render(Object.assign(
    req.params || {}, {
    title: process.env.TITLE || 'GEOLYTIX | XYZ',
    dir: process.env.DIR || '',
    token: req.params.token && req.params.token.signed || '""',
    log: process.env.LOG_LEVEL || '""',
    login: (process.env.PRIVATE || process.env.PUBLIC) && 'true' || '""',
  }))

  //Build the template with jsrender and send to client.
  res.send(html)
}