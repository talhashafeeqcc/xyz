export default _xyz => dataview => {

  dataview.target = dataview.target || _xyz.utils.wire()`<div>`;

  if (dataview.chart) {

    _xyz.dataview.chart(dataview.chart);

    dataview.target.appendChild(dataview.chart.div);

    dataview.update = () => {

      dataview.promise = _xyz.dataview.query(dataview);

      dataview.promise.then(response => {

        dataview.chart.setData(response);

        dataview.chart.ChartJS.update();

      });
    }

  }

  if (dataview.columns) {

    dataview.Tabulator = new _xyz.utils.Tabulator(dataview.target, Object.assign({
      invalidOptionWarnings: false,
      tooltipsHeader: true,
      columnHeaderVertAlign: 'center',
      layout: 'fitDataFill',
      height: 'auto',
      selectable: false,
      rowClick: (e, row) => {
        const rowData = row.getData();
        if (!dataview.layer || !rowData.id) return;
        _xyz.locations.select({
            locale: _xyz.workspace.locale.key,
            layer: dataview.layer,
            table: dataview.layer.tableCurrent(),
            id: rowData.id,
            //_flyTo: true,
        });
        row.deselect();
      }
    }, dataview));

    dataview.update = () => {

      dataview.promise = _xyz.dataview.query(dataview);

      dataview.promise.then(response => {

        dataview.Tabulator.setData(response.length && response || [response]);
        //dataview.Tabulator.redraw(true);
        
      });
    }

  }

  dataview.update();

  _xyz.mapview.node && _xyz.mapview.node.addEventListener('changeEnd', () => {
    if (!dataview.active) return
    dataview.update();
  });

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

    dataview.target.insertBefore(_xyz.utils.wire()`<div>${toolbar}`, dataview.target.querySelector('.tabulator-header'));

  }

  return dataview;

}