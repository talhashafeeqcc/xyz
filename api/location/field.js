const requestBearer = require('../../mod/requestBearer')

const layer = require('../../mod/layer')

const dbs = require('../../mod/pg/dbs')()

module.exports = (req, res) => requestBearer(req, res, [ layer, handler ], {
  public: true
})

async function handler(req, res) {

  const layer = req.params.layer

  let
    table = req.query.table,
    field = req.query.field,
    coords = req.query.coords && req.query.coords.split(','),
    id = req.query.id,
    qID = layer.qID

  if (coords) {

    var rows = await dbs[layer.dbs](`
    SELECT ${field}
    FROM ${table}
    ORDER BY ST_Point(${coords}) <#> ${layer.geom} LIMIT 1;`)

  } else {

    var rows = await dbs[layer.dbs](`
    SELECT ${field}
    FROM ${table}
    WHERE ${qID} = $1;`, [id])
  }

  if (rows instanceof Error) return res.status(500).send('Failed to query PostGIS table.')

  // return 204 if no record was returned from database.
  if (rows.length === 0) return res.status(202).send('No rows returned from table.')

  // Send the infoj object with values back to the client.
  res.send({ field: rows[0][field] })

}