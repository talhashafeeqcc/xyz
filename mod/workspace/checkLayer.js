const dbs = require('../pg/dbs')();

const logArray = [];

function log(msg) {
  console.log(msg);
  logArray.push(msg);
}

module.exports = async layers => {

  logArray.length = 0;

  log(' ');
  log('------Checking Layers------');
   
  for (const key of Object.keys(layers)) {

    const layer = layers[key];

    // Check whether the layer connects.
    await chkLayerConnect(layer, layers);

  }

  log('-----------------------------');
  log(' ');

  return logArray;

};

async function chkLayerConnect(layer, layers) {

  if (layer.format === 'cluster') await chkLayerGeom(layer, layers);

  if (layer.format === 'geojson') await chkLayerGeom(layer, layers);

  if (layer.format === 'grid') await chkLayerGeom(layer, layers);

  if (layer.format === 'mvt') await chkLayerGeom(layer, layers);
}

async function chkLayerGeom(layer, layers) {

  let tables = layer.tables ? Object.values(layer.tables) : [layer.table];

  for (const table of tables){

    // Don't invalidate layer with null in tables array.
    if (!table && tables.length > 1) continue;

    // Invalidate layer without table.
    if (!table) return;

    // Invalidate layer if no dbs has been defined.
    if (!layer.dbs || !dbs[layer.dbs]) {
      log(`!!! ${layer.locale}.${layer.key} | ${table}.${layer.geom} (${layer.format}) => Missing or invalid DBS connection`);
      return;
    }

    // Check whether table has layer geom field.
    let rows = await dbs[layer.dbs](`SELECT ${layer.geom} FROM ${table} LIMIT 1`);

    if (rows instanceof Error) {
      log(`!!! ${layer.locale}.${layer.key} | ${table}.${layer.geom} (${layer.format}) => ${rows.err.message}`);
      return;
    }

    log(`${layer.locale}.${layer.key} | ${table}.${layer.geom} (${layer.format}) => 'A-ok'`);

    // Check or create mvt_cache table.
    //if (layer.mvt_cache) await chkMVTCache(layer);
  }

}

async function createMVTCache(layer){

  let rows = await dbs[layer.dbs](`
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

  if (rows && rows.err) {
    log(`!!! ${layer.locale}.${layer.key} | ${layer.mvt_cache} (mvt cache) => Failed to create cache table`);
    return delete layer.mvt_cache;
  }

  log(`${layer.locale}.${layer.key} | ${layer.mvt_cache} (mvt cache) => Cache table created`);
}