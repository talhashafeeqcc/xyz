const auth = require('../mod/auth/handler')({
  public: true,
  login: true
})

const Md = require('mobile-detect')

const _templates = require('../mod/workspace/templates')

module.exports = async (req, res) => {

  await auth(req, res)

  if (res.finished) return

  const templates = await _templates(req, res)

  const md = new Md(req.headers['user-agent'])

  const template = templates[(md.mobile() === null || md.tablet() !== null) && '_desktop' || '_mobile'];
  
  const html = template.render({
    dir: process.env.DIR || '',
    title: process.env.TITLE || 'GEOLYTIX | XYZ',
    token: req.params.token && req.params.token.signed || '""',
    log: process.env.LOG_LEVEL || '""',
    login: (process.env.PRIVATE || process.env.PUBLIC) && 'true' || '""',
  })

  res.send(html)

}