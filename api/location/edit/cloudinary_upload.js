const crypto = require('crypto');

const request = require('request');

const requestBearer = require('../../../mod/requestBearer')

const layer = require('../../../mod/layer')

const dbs = require('../../../mod/pg/dbs')()

module.exports = (req, res) => requestBearer(req, res, [ layer, handler ], {
  public: true
})

async function handler(req, res) {

  const layer = req.params.layer
   
  const ts = Date.now()

  const public_id = () => {

    if (!req.query.public_id) return null

    const public_id_arr = decodeURIComponent(req.query.public_id).split('.')

    const public_id_name = `${public_id_arr[0]}_${ts}`
    
    return `${public_id_name}.${public_id_arr.pop()}`
  }
  
  const sig = crypto.createHash('sha1').update(`folder=${process.env.CLOUDINARY.split(' ')[3]}${public_id() && `&public_id=${public_id()}` || ''}&timestamp=${ts}${process.env.CLOUDINARY.split(' ')[1]}`).digest('hex')

  var data = [];

  req.on('data', chunk => {
    data.push(chunk)
  })

  req.on('end', () => {

    req.body = Buffer.concat(data);

    request.post({
      url: `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY.split(' ')[2]}/${req.query.resource_type}/upload`,
      body: {
        public_id: public_id(),
        file: req.query.resource_type === 'image' && `data:image/jpeg;base64,${req.body.toString('base64')}` || req.body.toString(),
        resource_type: req.query.resource_type,
        api_key: process.env.CLOUDINARY.split(' ')[0],
        folder: process.env.CLOUDINARY.split(' ')[3],
        timestamp: ts,
        signature: sig
      },
      json: true
    }, async (err, response, body) => {

      if (err) return console.error(err)

      var q = `
      UPDATE ${req.query.table}
      SET ${req.query.field} = array_append(${req.query.field}, '${body.secure_url}')
      WHERE ${layer.qID} = $1;`

      // add filename to images field
      await dbs[layer.dbs](q, [req.query.id])

      res.send({
        'public_id': body.public_id,
        'secure_url': body.secure_url
      })
    })

  })

}