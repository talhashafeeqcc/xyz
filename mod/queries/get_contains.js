module.exports = {
  template: _ => `
  SELECT ${fields.join()}
  FROM ${req.query.table}
  WHERE
    ST_Contains(${req.query.geom || layer.geom}, ST_SetSRID(ST_Point(${lng}, ${lat}), 4326))
    ${filter};`
}