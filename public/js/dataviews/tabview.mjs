export default _xyz => {

  const tabview = {
    init: init,
  };

  return tabview;

  function init(params) {

    if (!params.target) return;

    tabview.node = params.target;

    const bar = _xyz.utils.wire()`<div class="tab-bar">`

    tabview.bar = _xyz.utils.wire()`<div>`;

    bar.appendChild(tabview.bar);

    tabview.node.appendChild(bar);

    tabview.panel = _xyz.utils.wire()`<div class="tab-panel">`

    tabview.node.appendChild(tabview.panel);

    tabview.views = [];

    tabview.add = dataview => {

      // Add tab and target to panel if dataview tab already exists.
      if (dataview.show) {

        tabview.bar.appendChild(dataview.tab)
        tabview.panel.appendChild(dataview.target);

        tabview.views.push(dataview);

        return dataview.show();
      }

      dataview.show = () => {

        tabview.views.forEach(view => {
          view.target.style.display = 'none';
          view.tab.classList.remove('active');
          view.target.classList.remove('active');
        });

        dataview.tab.classList.add('active');
        dataview.target.style.display = 'grid';
        dataview.target.classList.add('active');
        tabview.node.style.display = 'block';
        if (_xyz.mapview.attribution.container) _xyz.mapview.attribution.container.style.bottom = '65px';
      }

      dataview.remove = () => {

        dataview.tab.remove();
        dataview.target.remove();

        tabview.views.splice(tabview.views.indexOf(dataview), 1);

        if (dataview.target.classList.contains('active')) {

          dataview.target.classList.remove('active');
          tabview.views[0] && tabview.views[0].show();
        }

        if (!tabview.views.length) {
          tabview.node.style.display = 'none';
          if (_xyz.mapview.attribution.container) _xyz.mapview.attribution.container.style.bottom = '0';
        }
      };

      dataview.tab = _xyz.utils.wire()`
      <div
        style="${dataview.tab_style || ''}"
        class="active"
        onclick=${() => {

            dataview.show();

        }}>${dataview.title || dataview.key || dataview.label}`

      tabview.bar.appendChild(dataview.tab);

      dataview.target = _xyz.utils.wire()`<div class="${dataview.class || ''}" style="${dataview.style || ''}">`;

      tabview.panel.appendChild(dataview.target);

      _xyz.dataviews.create(dataview);

      tabview.views.push(dataview);

      dataview.show();

    }

  }

}