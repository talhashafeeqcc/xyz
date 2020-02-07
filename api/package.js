const requestBearer = require('../mod/requestBearer')

const package = require('../package.json')

module.exports = (req, res) => requestBearer(req, res, [ handler ], {
  public: true
})

async function handler(req, res){

  res.send(package)

}