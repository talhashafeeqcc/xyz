const auth = require('../mod/auth/handler')({
  public: true,
  login: true
})

const provider = require('../mod/provider')

const fetch = require('node-fetch')

module.exports = async (req, res) => {

  await auth(req, res)

  if (res.finished) return

  let tmpl

  if (req.query.template.toLowerCase().includes('api.github')) {

    tmpl = await provider(req.query.template);

  } else {

    const response = await fetch(`${req.headers.host.includes('localhost') && 'http' || 'https'}://${req.headers.host}${process.env.DIR || ''}${req.query.template}`)
    if (response.status !== 200) return res.type('text/plain').send('Failed to retrieve report template')
    tmpl = await response.text()

  }

  const render = params => tmpl.replace(/\$\{(.*?)\}/g, matched=>params[matched.replace(/\$|\{|\}/g,'')] || '')

  const html = render({
    dir: process.env.DIR || '',
    host: `${req.headers.host.includes('localhost') && 'http' || 'https'}://${req.headers.host}${process.env.DIR || '' || ''}`,
    token: req.query.token || req.params.token.signed || '""'
  })

  //Build the template with jsrender and send to client.
  res.send(html)

}