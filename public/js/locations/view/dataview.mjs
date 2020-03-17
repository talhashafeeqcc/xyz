export default _xyz => entry => {

  if (!entry.query) return;

  entry.xhr = new XMLHttpRequest();

  entry.xhr.open('GET', _xyz.host + '/api/query?' +
    _xyz.utils.paramString({
      locale: _xyz.workspace.locale.key,
      layer: entry.location.layer.key,
      id: entry.location.id,
      template: encodeURIComponent(entry.query),
      token: _xyz.token
    }));

  entry.xhr.setRequestHeader('Content-Type', 'application/json');
  entry.xhr.responseType = 'json';

  entry.xhr.onload = e => {

    if (e.target.status !== 200) return;

    if (entry.chart) {
      // get data from response based on fields setup
      Object.values(entry.chart.datasets || []).map(dataset => {

        if (!dataset.fields) return;

        dataset.data = [];

        dataset.fields
          .map(f => {
            Array.isArray(e.target.response[f]) ? dataset.data = e.target.response[f] : dataset.data.push(Number(e.target.response[f]));
          });
      });

      if (!entry.chart.datasets) entry.fields = e.target.response;

      const dataview = _xyz.dataview.charts.create(entry);

      entry.dataview.innerHTML = '';

      entry.dataview.appendChild(dataview);
    }

    if (entry.columns) {

      entry.dataview.innerHTML = '';

      entry.Tabulator = new _xyz.utils.Tabulator(entry.dataview, {
        invalidOptionWarnings: false,
        tooltipsHeader: true,
        columnHeaderVertAlign: 'center',
        columns: entry.columns,
        layout: entry.layout || 'fitDataFill',
        height: entry.height || 'auto'
      });

      if (entry.toolbars) {

        const toolbar = _xyz.utils.wire()`<ul style="text-align: end; border: 1px solid #DDD; border-top: none;">`;

        toolbar.appendChild(_xyz.utils.wire()`
        <li
          class="off-white-hover primary-colour"
          title="Download as CSV"
          style="display: inline; margin-right: 4px;"
          onclick=${() => entry.Tabulator.download('csv', `${entry.title}.csv`)}>CSV</li>`);

        toolbar.appendChild(_xyz.utils.wire()`
        <li
          class="off-white-hover primary-colour"
          title="Download as JSON"
          style="display: inline; margin-right: 4px;"
          onclick=${() => entry.Tabulator.download('json', `${entry.title}.json`)}>JSON</li>`);

        entry.dataview.insertBefore(_xyz.utils.wire()`<div>${toolbar}`, entry.dataview.querySelector('.tabulator-header'));

      }

      entry.Tabulator.setData(e.target.response);
      entry.Tabulator.redraw(true);

    }

  }

  entry.xhr.send();

};