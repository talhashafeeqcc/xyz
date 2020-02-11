module.exports = {
  template: _ => `
  SELECT ${_.fields}
  FROM ${_.table}
  WHERE
    ST_Contains(${_.geom || _.layer.geom}, ST_SetSRID(ST_Point(${_.lng}, ${_.lat}), 4326))
    ${_.filter};`
}