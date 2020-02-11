module.exports = {
  template: _ => `
  WITH T AS (
    SELECT ${req.query.geom || layer.geom} AS _geom
    FROM ${req.query.table}
    WHERE ST_Contains(${req.query.geom || layer.geom}, ST_SetSRID(ST_Point(${req.query.lng}, ${req.query.lat}), 4326))
    LIMIT 1
  )
  SELECT ${fields.join()} FROM ${req.query.table}, T
  WHERE
    ST_Intersects(${req.query.geom || layer.geom}, _geom)
    ${filter};`
}