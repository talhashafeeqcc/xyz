export default _xyz => {

  const tabview = {
    init: init,
    add: add,
  };

  return tabview;

  function init(params) {

    if (!params.target) return;

    tabview.node = params.target;

    tabview.bar = tabview.node.querySelector('.tab-bar > div');

    tabview.panel = tabview.node.querySelector('.tab-panel');

    tabview.views = [];

  };

  function add(dataview) {

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
        delete dataview.active;
      });

      dataview.tab.classList.add('active');
      dataview.target.style.display = 'block';
      dataview.active = true;
      tabview.node.style.display = 'block';
      _xyz.mapview.attribution.container.style.bottom = '65px';
    }

    dataview.remove = () => {

      dataview.tab.remove();
      dataview.target.remove();

      tabview.views.splice(tabview.views.indexOf(dataview), 1);

      if (dataview.active) {

        delete dataview.active;
        tabview.views[0] && tabview.views[0].show();
      }

      if (!tabview.views.length) {
        tabview.node.style.display = 'none';
        _xyz.mapview.attribution.container.style.bottom = '0';
      }
    };

    dataview.tab = _xyz.utils.wire()`
    <div
      class="active"
      onclick=${e => {

        dataview.show();

      }}>${dataview.title || dataview.key || dataview.label}`

    tabview.bar.appendChild(dataview.tab);


    dataview.target = document.getElementById(dataview.target) || _xyz.utils.wire()`<div>`;

    tabview.panel.appendChild(dataview.target);

    if (dataview.script) {

      const script = _xyz.utils.wire()`<script src="${dataview.script}">`;

      function addDashboard(e) {
        e.detail(_xyz, dataview);
        document.removeEventListener('addDashboard', addDashboard);
        script.remove();
      }

      document.addEventListener('addDashboard', addDashboard, true);

      tabview.panel.appendChild(script);

    } else {

      dataview.toolbar = true;
      _xyz.dataviews.dataview(dataview);

    }

    tabview.views.push(dataview);

    dataview.show();

  }

}