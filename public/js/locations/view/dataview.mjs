export default _xyz => entry => {

  entry.layer = entry.location.layer;

  entry.id = entry.location.id;

  _xyz.dataviews.tabview.add(entry);

  entry.location.dataviews.push(entry);

};