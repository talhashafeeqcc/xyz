const requestBearer = require('../mod/requestBearer')

const provider = require('../mod/provider')

module.exports = (req, res) => requestBearer(req, res, [ handler ], {
  public: true
})

async function handler(req, res){

 const fetch = provider[req.params.provider]

 req.body = req.body && await bodyData(req) || null

 const content = await fetch(req)

 if (req.query.content_type) res.setHeader('content-type', req.query.content_type)

 res.send(content)

}

function bodyData(req) {

  return new Promise((resolve, reject) => {

    const chunks = []

    req.on('data', chunk => chunks.push(chunk))
  
    req.on('end', () => resolve(Buffer.concat(chunks)))

  });
}