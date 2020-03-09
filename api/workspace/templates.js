const auth = require('../../mod/auth/handler')({
  public: true
})

const clearCache = require('../../mod/workspace/clearCache')

const _templates = require('../../mod/workspace/templates')

let templates

module.exports = async (req, res) => {

  await auth(req, res)

  templates = await _templates(req, res)

  // Send workspace
  res.send(templates)

}