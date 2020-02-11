const requestBearer = require('../mod/requestBearer')

const getWorkspace = require('../mod/workspace/get')

const workspace = getWorkspace()

const getViews = require('../mod/views/_views')

const views = getViews(workspace)

module.exports = (req, res) => requestBearer(req, res, [ handler ], {
  public: true,
  login: true
})

async function handler(req, res){

  if (req.query.clear_cache) {
    Object.assign(workspace, getWorkspace())
    Object.assign(views, getQueries(workspace))
    return res.end()
  }

  Object.assign(workspace, await workspace)
  Object.assign(views, await views)
  
  const html = views[req.params.template].template({
    title: process.env.TITLE || 'GEOLYTIX | XYZ',
    dir: process.env.DIR || '',
    token: req.query.token || req.params.token.signed || '""',
  })

  //Build the template with jsrender and send to client.
  res.send(html)

}