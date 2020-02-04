const auth = require('../../mod/auth/handler')

const _workspace = require('../../mod/workspace/get')()

module.exports = (req, res) => auth(req, res, handler, {
  public: true
})

async function handler(req, res) {

  const workspace =  await _workspace

  const locales = JSON.parse(JSON.stringify(workspace.locales))

  // (function objectEval(o, parent, key) {

  //   // check whether the object has an access key matching the current level.
  //   if (Object.entries(o).some(
  //     e => e[0] === 'roles' && !Object.keys(e[1]).some(
  //       role => req.params.token.roles && req.params.token.roles.includes(role)
  //     )
  //   )) {

  //     // if the parent is an array splice the key index.
  //     if (parent.length > 0) return parent.splice(parseInt(key), 1);

  //     // if the parent is an object delete the key from the parent.
  //     return delete parent[key];
  //   }

  //   // iterate through the object tree.
  //   Object.keys(o).forEach((key) => {
  //     if (o[key] && typeof o[key] === 'object') objectEval(o[key], o, key);
  //   });

  // })(locales);

  // Send workspace
  res.send({ locales: locales })

}