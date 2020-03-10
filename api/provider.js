const auth = require('../mod/auth/handler')({
  public: true
})

const provider = require('../mod/provider')

module.exports = async (req, res) => {

  await auth(req, res)

  const fetch = provider[req.params.provider]

  req.body = req.body && await bodyData(req) || null

  const content = await fetch(req)

  req.params.content_type && res.setHeader('content-type', req.params.content_type)

  res.send(content)

}

function bodyData(req) {

  return new Promise((resolve, reject) => {

    const chunks = []

    req.on('data', chunk => chunks.push(chunk))

    req.on('end', () => resolve(Buffer.concat(chunks)))

  });
}