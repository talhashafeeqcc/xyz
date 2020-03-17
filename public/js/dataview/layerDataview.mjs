export default _xyz => dataview => {

  const xhr = new XMLHttpRequest();

  const bounds = _xyz.mapview && _xyz.mapview.getBounds();

  // Create filter from legend and current filter.
  const filter = dataview.layer.filter && Object.assign({}, dataview.layer.filter.legend, dataview.layer.filter.current);

  xhr.open('GET', _xyz.host + '/api/query?' +
    _xyz.utils.paramString({
      locale: _xyz.workspace.locale.key,
      layer: dataview.layer.key,
      chart: dataview.key,
      template: encodeURIComponent(dataview.query),
      filter: JSON.stringify(filter),
      srid: _xyz.mapview.srid,
      west: bounds && bounds.west,
      south: bounds && bounds.south,
      east: bounds && bounds.east,
      north: bounds && bounds.north,
      token: _xyz.token
    }));

  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.responseType = 'json';

  xhr.onload = e => {

    if (e.target.status !== 200) return;

    if (dataview.chart) {

      Object.values(dataview.chart.datasets || []).map(dataset => {

        if (!dataset.fields) return;

        dataset.data = [];

        dataset.fields
          .map(f => {
            Array.isArray(e.target.response[f]) ? dataset.data = e.target.response[f] : dataset.data.push(Number(e.target.response[f]));
          });

      });

      if (!dataview.chart.datasets) dataview.fields = e.target.response;

      const _dataview = _xyz.dataview.charts.create(dataview);

      dataview.dataview.appendChild(_dataview);

    }

    if (dataview.columns) {

      dataview.Tabulator = new _xyz.utils.Tabulator(dataview.dataview, Object.assign({
        invalidOptionWarnings: false,
        tooltipsHeader: true,
        columnHeaderVertAlign: 'center',
        layout: 'fitDataFill',
        height: 'auto'
      }, dataview));

      if (dataview.toolbars) {

        const toolbar = _xyz.utils.wire()`<ul style="text-align: end; border: 1px solid #DDD; border-top: none;">`;

        toolbar.appendChild(_xyz.utils.wire()`
        <li 
          class="off-white-hover primary-colour" 
          title="Download as CSV"
          style="display: inline; margin-right: 4px;" 
          onclick=${() => dataview.Tabulator.download('csv', `${dataview.title}.csv`)}>CSV</li>`);

        toolbar.appendChild(_xyz.utils.wire()`
        <li 
          class="off-white-hover primary-colour" 
          title="Download as JSON"
          style="display: inline; margin-right: 4px;" 
          onclick=${() => dataview.Tabulator.download('json', `${dataview.title}.json`)}>JSON</li>`);

        dataview.dataview.insertBefore(_xyz.utils.wire()`<div>${toolbar}`, dataview.dataview.querySelector('.tabulator-header'));

      }

      dataview.Tabulator.setData(e.target.response.length ? e.target.response : [e.target.response]);
      dataview.Tabulator.redraw(true);

    }
  }

  xhr.send();

}