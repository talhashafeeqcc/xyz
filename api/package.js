const package = require('../package.json');

const auth = require('../mod/auth/handler');

module.exports = (req, res) => auth(req, res, handler, {
  public: true
});

async function handler(req, res){

  res.send(package);

};