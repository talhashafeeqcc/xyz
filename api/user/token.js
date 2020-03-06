const auth = require('../../mod/auth/handler')({
  login: true
})

module.exports = async (req, res) => {

  await auth(req, res)

  if (res.finished) return

  res.send(req.params.token.signed)

}