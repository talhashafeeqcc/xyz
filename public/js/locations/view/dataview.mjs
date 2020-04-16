export default _xyz => entry => {

  entry.layer = entry.location.layer;

  entry.id = entry.location.id;

  if (entry._target === 'location') return entry.target;

  entry._target = entry.target;

  // dataview will be added to location listview
  if (entry.target === 'location') {

    entry.target =  _xyz.utils.wire()`
    <div
      class=${entry.class}
      style="grid-column: 1 / 3; padding-top: 10px;">`;

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

    entry.tab_style = `border-bottom: 2px solid ${entry.location.style.strokeColor}`;

    _xyz.dataviews.tabview.add(entry);

    entry.location.tabviews.push(entry);
  }

};