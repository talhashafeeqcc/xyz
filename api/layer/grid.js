const auth = require('../../mod/auth/handler')

const getWorkspace = require('../../mod/workspace/get')

const workspace = getWorkspace()

const dbs = require('../../mod/pg/dbs')()

module.exports = (req, res) => auth(req, res, handler, {
  public: true
});

async function handler(req, res, token = {}) {

  if (req.query.clear_cache) {
    Object.assign(workspace, getWorkspace())
    return res.end()
  }

  Object.assign(workspace, await workspace)

  const locale = workspace.locales[req.query.locale]

  const layer = locale.layers[req.query.layer]

  let
    table = req.query.table,
    geom = layer.geom,
    size = req.query.size,
    color = req.query.color,
    srid = layer.srid,
    west = parseFloat(req.query.west),
    south = parseFloat(req.query.south),
    east = parseFloat(req.query.east),
    north = parseFloat(req.query.north)

  var q = `
  SELECT
    ST_X(ST_Transform(${layer.geom},${srid})) x,
    ST_Y(ST_Transform(${layer.geom},${srid})) y,
    ${size} size,
    ${color} color
  FROM ${table}
  WHERE
    ST_DWithin(
      ST_MakeEnvelope(${west}, ${south}, ${east}, ${north}, ${srid}),
    ${geom}, 0.000001)
    AND ${size} >= 1 LIMIT 10000;`


  var rows = await dbs[layer.dbs](q)

  if (rows instanceof Error) return res.status(500).send('Failed to query PostGIS table.')

  if (rows.length === 0) return res.status(204).send()

  res.send(rows.map(row => Object.keys(row).map(field => row[field])))

}