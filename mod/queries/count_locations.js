module.exports = {
  template: _ => `
  SELECT count(1)
  FROM ${_.table}
  WHERE true ${_.filter};`
}