export default _xyz => {

  const data = {

    panel: panel,

  }

  return data;


  function panel(layer) {

    if (!layer.dataview || !_xyz.dataview.node) return;

    const panel = _xyz.utils.wire()`
    <div class="drawer panel expandable">`;
  
    // Panel header
    panel.appendChild(_xyz.utils.wire()`
    <div
      class="header primary-colour"
      onclick=${e => {
        e.stopPropagation();
        _xyz.utils.toggleExpanderParent(e.target, true);
      }}><span>Data Views</span><button
      class="btn-header xyz-icon icon-expander primary-colour-filter">`);

      Object.keys(layer.dataview).forEach(key => {

        const tab = layer.dataview[key];

        tab.key = key;
        tab.layer = layer;
        tab.title = tab.title || key;

        tab.target = _xyz.dataview.node.querySelector('.table');

        tab.show = () => _xyz.dataview.layerDashboard(tab);
        tab.remove = () => _xyz.dataview.removeTab(tab);

        // Create checkbox to toggle whether table is in tabs list.
        panel.appendChild(_xyz.utils.wire()`
        <label class="input-checkbox">
        <input
          type="checkbox"
          checked=${!!tab.display}
          onchange=${e => {
            tab.display = e.target.checked;
            if (tab.display) return layer.show();
            tab.remove();
            if(!_xyz.dataview.tables.length) _xyz.mapview.node.dispatchEvent(new CustomEvent('updatesize'));
          }}>
        </input>
        <div></div><span>${tab.title}`);

        if (tab.display && layer.display) tab.show();
      });

    return panel;

  };

}