const requestBearer = require('../../mod/requestBearer')

const dbs = require('../../mod/pg/dbs')()

const layer = require('../../mod/layer')

module.exports = (req, res) => requestBearer(req, res, [ layer, handler ], {
  admin_workspace: true,
  login: true
});

async function handler(req, res) {

  const layer = req.params.layer

  var rows = await dbs[layer.dbs](`
    DROP table if exists ${layer.mvt_cache};
    
    Create UNLOGGED table ${layer.mvt_cache}
    (
      z integer not null,
      x integer not null,
      y integer not null,
      mvt bytea,
      tile geometry(Polygon, ${layer.srid}),
      constraint ${layer.mvt_cache.replace(/\./,'_')}_z_x_y_pk
        primary key (z, x, y)
    );
    
    Create index ${layer.mvt_cache.replace(/\./,'_')}_tile on ${layer.mvt_cache} (tile);`);

  if (rows instanceof Error) return res.status(500).send('Failed to query PostGIS table.')

  res.send(`Created ${layer.mvt_cache}`);

}