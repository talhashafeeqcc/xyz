const requestBearer = require('../../mod/requestBearer')

const layer = require('../../mod/layer')

const dbs = require('../../mod/pg/dbs')()

module.exports = (req, res) => requestBearer(req, res, [ layer, handler ], {
  public: true
})

async function handler(req, res) {

  const layer = req.params.layer

  const tableDef = layer.infoj.find(entry => entry.title === decodeURIComponent(req.query.tableDef))

  const fields = tableDef.columns.map(col => `(${col.fieldfx || col.field})::${col.type || 'text'} AS ${col.field}`)

  var q = `
  SELECT ${fields.join(',')} 
  FROM ${tableDef.from}
  ${tableDef.where ? `WHERE ${tableDef.where}` : ``}
  ${tableDef.orderby ? `ORDER BY ${tableDef.orderby}` : ``} NULLS LAST
  LIMIT ${tableDef.limit || 100};`;

  const rows = await dbs[layer.dbs](q, [req.query.id])

  if (rows instanceof Error) return res.status(500).send('Failed to query PostGIS table.')

  res.send(rows)
}