export default _xyz => entry => {

  if(!_xyz.dataview.node && !document.getElementById(entry.target_id)) return;

  entry.listview.appendChild(_xyz.utils.wire()`
  <div style="padding-top: 4px; grid-column: 1 / span 2;"
  class=${'lv-' + (entry.level || 0) + ' ' + (entry.class || '')}>
  <label class="input-checkbox">
  <input type="checkbox"
    checked=${!!entry.display}
    onchange=${e => {
      entry.display = e.target.checked;
      entry.display ? showTab() : removeTab();
      if(!_xyz.dataview.tables.length) _xyz.mapview.node.dispatchEvent(new CustomEvent('updatesize'));
    }}>
  </input>
  <div></div><span>${entry.title || 'Show dashboard'}`);

  if (entry.display) showTab();

  function showTab() {

    entry.location.tables.push(entry);

    entry.target = _xyz.dataview.node && _xyz.dataview.node.querySelector('.tab-content') || document.getElementById(entry.target_id);

    if (entry.target) _xyz.dataview.dashboard(entry);
  }

  function removeTab() {

    let idx = entry.location.tables.indexOf(entry);

    if (idx < 0) return;

    entry.location.tables.splice(idx, 1);

    _xyz.dataview.removeTab(entry);

  }

};