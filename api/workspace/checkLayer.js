const auth = require('../../mod/auth/handler');

const _workspace = require('../../mod/workspace/get')();

const checkLayer = require('../../mod/workspace/checkLayer');

module.exports = (req, res) => auth(req, res, handler, {
  admin_workspace: true,
  login: true
});

async function handler(req, res, token){

  const workspace = await _workspace;

  const layers = workspace.locales[req.query.locale || Object.keys(workspace.locales)[0]].layers;

  const chk = await checkLayer(layers);

  res.send(chk);

}