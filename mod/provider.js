const fetch = require('node-fetch')

const _cloudinary = require('cloudinary').v2

module.exports = {

  github: async req => await github(req),

  here: async req => await here(req),

  mapbox: async req => await mapbox(req),

  opencage: async req => await opencage(req),

  google: async req => await google(req),

  cloudinary: async req => await cloudinary(req),
}

async function github(req) {

  const url = req.url && req.url.split('url=').pop() || req

  const response = await fetch(`https://${url.replace(/https:/,'').replace(/\/\//,'')}`, {headers: new fetch.Headers({Authorization:`token ${process.env.KEY_GITHUB}`})})

  const b64 = await response.json()

  const buff = await Buffer.from(b64.content, 'base64')

  return await buff.toString('utf8')
}

async function here(req) {

  const url = req.url && req.url.split('url=').pop() || req

  console.log(req.url)

  //console.log(`https://${decodeURIComponent(url)}&${process.env.KEY_HERE}`)

  const response = await fetch(`https://${decodeURIComponent(url)}&${process.env.KEY_HERE}`)

  return await response.json()
}

async function mapbox(req) {

  const url = req.url && req.url.split('url=').pop() || req

  const response = await fetch(`https://${url}&${process.env.KEY_MAPBOX}`.replace(/\&provider=mapbox/,''))

  return await response.json()
}

async function opencage(req) {

  const url = req.url && req.url.split('url=').pop() || req

  const response = await fetch(`https://${url}&key=${process.env.KEY_OPENCAGE}`)

  return await response.json()
}

async function google(req) {

  const url = req.url && req.url.split('url=').pop() || req

  const response = await fetch(`https://${url}&${process.env.KEY_GOOGLE}`)

  return await response.json()
}

async function cloudinary(req) {

  _cloudinary.config({
    api_key: process.env.CLOUDINARY.split(' ')[0],
    api_secret: process.env.CLOUDINARY.split(' ')[1],
    cloud_name: process.env.CLOUDINARY.split(' ')[2],
  })

  if (req.query.destroy) return await _cloudinary.uploader.destroy(`${process.env.CLOUDINARY.split(' ')[3]}/${req.query.public_id}`)

  const ressource = req.query.resource_type === 'raw' && req.body.toString() || `data:image/jpeg;base64,${req.body.toString('base64')}`

  return await _cloudinary.uploader.upload(ressource,
    {
      resource_type: req.query.resource_type,
      public_id: `${process.env.CLOUDINARY.split(' ')[3]}/${Date.now()}`,
      overwrite: true,
    })
}