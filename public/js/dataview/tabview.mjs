export default _xyz => {

  const tabview = {
    init: init,
    add: add,
  };

  return tabview;

  function init(params) {

    if (!params.target) return;

    tabview.node = params.target;

    tabview.nav = params.target.querySelector('.nav_bar > ul.nav_bar-nav');

    tabview.panel = document.querySelector('.tab-content');

    tabview.views = [];

    document.body.style.gridTemplateRows = 'minmax(0, 1fr) 80px';

  };

  function add(dataview) {

    // Add tab and target to panel if dataview tab already exists.
    if (dataview.show) {

      tabview.nav.appendChild(dataview.tab)
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
    }

    dataview.remove = () => {

      dataview.tab.remove();
      dataview.target.remove();

      tabview.views.splice(tabview.views.indexOf(dataview), 1);

      if (dataview.active) {

        delete dataview.active;
        tabview.views[0] && tabview.views[0].show();
      }
    };

    dataview.tab = _xyz.utils.wire()`
    <li
      class="active"
      onclick=${e => {

        dataview.show();

      }}>${dataview.title || dataview.key || dataview.label}`

    tabview.nav.appendChild(dataview.tab);


    dataview.target = document.getElementById(dataview.target) || _xyz.utils.wire()`<div>`;

    tabview.panel.appendChild(dataview.target);

    if (dataview.src) {

      const script = _xyz.utils.wire()`<script src="${dataview.src}">`;

      function addDashboard(e) {
        e.detail(_xyz, dataview);
        document.removeEventListener('addDashboard', addDashboard);
        script.remove();
      }

      document.addEventListener('addDashboard', addDashboard, true);

      tabview.panel.appendChild(script);

    } else {

      _xyz.dataview.dataview(dataview);

    }

    tabview.views.push(dataview);

    dataview.show();

  }

}