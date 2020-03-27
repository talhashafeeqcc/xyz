export default _xyz => entry => {

  if (!entry.query) return;

  entry.layer = entry.location.layer;

  entry.id = entry.location.id;

  _xyz.dataview.tabview.add(entry);

  entry.location.dataviews.push(entry);

};