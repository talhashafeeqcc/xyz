module.exports = {
template: _ => `
SELECT ${_.select}
FROM ${_.from}
WHERE true ${_.filter || ''} 
ORDER BY ST_Transform(ST_SetSRID(ST_Point(${_.lng}, ${_.lat}), 4326), ${_.srid}) <#> ${_.geom}
LIMIT ${_.nnearest || 3};`}