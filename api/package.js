const auth = require('../mod/auth/handler')

const package = require('../package.json')

module.exports = (req, res) => auth(req, res, handler, {
  public: true
})

async function handler(req, res){

  res.send(package)

}