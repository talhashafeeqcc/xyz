export default _xyz => entry => {

  entry.layer = entry.location.layer;

  entry.id = entry.location.id;


  // dataview will be added to location listview
  if (entry.target === 'location') {

    entry.target =  _xyz.utils.wire()`
    <div style="grid-column: 1 / span 2; width: 100%;">`;

    _xyz.dataviews.dataview(entry);

    return entry.target;
  }


  // dataview can be added to a designated target (e.g. on report)
  if (document.getElementById(entry.target)) {

    entry.target = document.getElementById(entry.target);

    _xyz.dataviews.dataview(entry);

    return;
  }


  // dataview will be added to tabview
  if (_xyz.dataviews.tabview.node) {

    _xyz.dataviews.tabview.add(entry);

    entry.location.dataviews.push(entry);
  }

};