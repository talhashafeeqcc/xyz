const _templates = require('../workspace/templates')

const acl = require('./acl')()

module.exports = async (req, res, msg) => {

  if (!acl) return res.send('No Access Control List.')

  const rows = await acl(`select * from acl_schema.acl_table limit 1`)

  if (rows instanceof Error) return res.send('Failed to connect with Access Control List.')

  const templates = await _templates(req)

  const html = templates._login.render({
    dir: process.env.DIR || '',
    redirect: req.url && decodeURIComponent(req.url),
    msg: msg || ' ',
    captcha: process.env.GOOGLE_CAPTCHA && process.env.GOOGLE_CAPTCHA.split('|')[0] || '',
  })

  res.send(html)
}