const auth = require('../../mod/auth/handler')

const dbs = require('../../mod/pg/dbs')()

module.exports = (req, res) => auth(req, res, handler, {
  admin_workspace: true,
  login: true
});

async function handler(req, res, token = {}) {

  const workspace = await getWorkspace();

  const locale = workspace.locales[req.query.locale]

  const layer = locale.layers[req.query.layer]

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