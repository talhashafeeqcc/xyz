module.exports = {
admin_workspace: true,
template: _ => `
DROP table if exists ${_.table};
    
Create UNLOGGED table ${_.table}
(
  z integer not null,
  x integer not null,
  y integer not null,
  mvt bytea,
  tile geometry(Polygon, ${_.srid || 3857}),
  constraint ${_.table.replace(/\./,'_')}_z_x_y_pk
    primary key (z, x, y)
);

Create index IF NOT EXISTS ${_.table.replace(/\./,'_')}_tile on ${_.table} (tile);`}