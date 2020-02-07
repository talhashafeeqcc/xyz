const requestBearer = require('../../mod/requestBearer')

module.exports = (req, res) => requestBearer(req, res, [ handler ], {login:true})

async function handler(req, res){

  res.send(req.params.token.signed)

}