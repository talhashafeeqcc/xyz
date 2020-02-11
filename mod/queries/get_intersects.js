module.exports = {
  template: _ => `
  WITH T AS (
    SELECT ${_.geom || _.layer.geom} AS _geom
    FROM ${_.table}
    WHERE ST_Contains(${_.geom || layer.geom}, ST_SetSRID(ST_Point(${_.lng}, ${_.lat}), 4326))
    LIMIT 1
  )
  SELECT ${_.fields} FROM ${_.table}, T
  WHERE
    ST_Intersects(${_.geom || _.layer.geom}, _geom)
    ${_.filter};`
}