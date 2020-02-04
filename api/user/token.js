const auth = require('../../mod/auth/handler');

module.exports = (req, res) => auth(req, res, handler, {
  login: true
});

async function handler(req, res, token){

  res.send(token.signed);

}