const getWorkspace = require('../workspace/get')

let workspace = getWorkspace()

const getTemplates = require('../templates/_templates')

let _templates = getTemplates(workspace)

module.exports = async (req, res, msg) => {

  const templates = await _templates

  const html = templates._login.render({
    dir: process.env.DIR || '',
    action: req.url && decodeURIComponent(req.url),
    msg: msg || ' ',
    captcha: process.env.GOOGLE_CAPTCHA && process.env.GOOGLE_CAPTCHA.split('|')[0] || '',
  })

  res.send(html);
}