const requestBearer = require('../mod/requestBearer')

const provider = require('../mod/provider')

module.exports = (req, res) => requestBearer(req, res, [ handler ], {
  public: true
})

async function handler(req, res){

 const fetch = provider[req.params.provider]

 const content = await fetch(decodeURIComponent(req.url.split('?url=').pop()))

 if (req.query.content_type) res.setHeader('content-type', req.query.content_type)

 res.send(content)

}