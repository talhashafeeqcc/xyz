const crypto = require('crypto');

const request = require('request');

const auth = require('../../../mod/auth/handler')

const _workspace = require('../../../mod/workspace/get')()

const dbs = require('../../../mod/pg/dbs')()

module.exports = (req, res) => auth(req, res, handler, {
  public: true
})

async function handler(req, res, token = {}) {

  const workspace = await _workspace

  const locale = workspace.locales[req.query.locale]

  const layer = locale.layers[req.query.layer]

  const ts = Date.now()

  const sig = crypto.createHash('sha1').update(`public_id=${req.query.image_id}&timestamp=${ts}${process.env.CLOUDINARY.split(' ')[1]}`).digest('hex')

  request.post({
    url: `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY.split(' ')[2]}/image/destroy`,
    body: {
      'api_key': process.env.CLOUDINARY.split(' ')[0],
      'public_id': req.query.public_id,
      'timestamp': ts,
      'signature': sig
    },
    json: true
  }, async (err, response, body) => {

    if (err) return console.error(err)

    var q = `
    UPDATE ${req.query.table}
    SET ${req.query.field} = array_remove(${req.query.field}, '${decodeURIComponent(req.query.secure_url)}')
    WHERE ${layer.qID} = $1;`

    await dbs[layer.dbs](q, [req.query.id])

    res.send('Deleted')

  })

}