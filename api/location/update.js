const auth = require('../../mod/auth/handler')({
  public: true
})

const dbs = require('../../mod/pg/dbs')()

const _layers = require('../../mod/workspace/layers')

module.exports = async (req, res) => {

  await auth(req, res)

  const layers = await _layers(req, res)

  if (res.finished) return

  const layer = layers[req.params.layer]

  const fields = Object.entries(req.body)
    .map(entry => {
      if (typeof entry[1] === 'string') return ` ${entry[0]} = '${entry[1]}'`
      if (typeof entry[1] === 'object') return ` ${entry[0]} = '${JSON.stringify(entry[1])}'`
      if (typeof entry[1] === 'boolean' || typeof entry[1] === 'number') return ` ${entry[0]} = ${entry[1]}`
    })

  // var fields = ''
  
  // await req.body.infoj.forEach(entry => {
        
  //   if (!entry.field) return
        
  //   if (fields.length > 0) fields += ', '
        
  //   if (entry.type === 'integer') {
  //     let parsed = parseInt(entry.newValue)
  //     return fields += `${entry.field} = ${ parsed || parsed === 0 ? parsed : null }`
  //   }
        
  //   if (entry.type === 'date' || entry.type === 'datetime') return fields += `${entry.field} = ${entry.newValue}`

  //   if (entry.type === 'boolean') return fields += `${entry.field} = ${entry.newValue}`
        
  //   fields += `${entry.field} = '${entry.newValue.replace(/'/g, '\'\'')}'`
  // })
  
  var q = `UPDATE ${req.params.table} SET ${fields.join()} WHERE ${layer.qID} = $1;`

  var rows = await dbs[layer.dbs](q, [req.params.id])

  if (rows instanceof Error) return res.status(500).send('PostgreSQL query error - please check backend logs.')

  // Remove tiles from mvt_cache.
  if (layer.mvt_cache) await dbs[layer.dbs](`
      DELETE FROM ${layer.mvt_cache}
      WHERE ST_Intersects(tile, (
        SELECT ${layer.geom}
        FROM ${req.params.table}
        WHERE ${layer.qID} = $1));`,
        [req.params.id])

  res.send('This is fine.')

  //return res.redirect(`${process.env.DIR||''}/api/location/get`)

}