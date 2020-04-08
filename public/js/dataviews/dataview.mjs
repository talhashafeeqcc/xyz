export default _xyz => {

  return create;

  function array(dataview) {

    dataview.dataviews.forEach(_dataview => {
      _dataview.layer = dataview.layer;
      _dataview.id = dataview.id;
      _dataview.target = _xyz.utils.wire()`
        <div class="${_dataview.class || ''}" style="${_dataview.style || ''}">`;
      dataview.target.appendChild(_dataview.target);
      create(_dataview);
    });

    return dataview;
  }

  function create(dataview) {

    dataview.target = dataview.target instanceof HTMLElement && dataview.target
    || _xyz.utils.wire()`<div class="${dataview.class || ''}" style="${dataview.style || ''}">`;

    if (dataview.dataviews) return array(dataview);

    const toolbar = _xyz.utils.wire()`<div class="toolbar">`;

    dataview.target.appendChild(toolbar);

    const target = _xyz.utils.wire()`<div>`;

    dataview.target.appendChild(target);

    if (dataview.chart) {

      _xyz.dataviews.chart(dataview.chart);

      target.appendChild(dataview.chart.div);

      dataview.update = () => {

        dataview.promise = _xyz.dataviews.query(dataview);

        dataview.promise.then(response => {

          dataview.chart.setData(response);

          dataview.chart.ChartJS.update();

        });
      }

    }

    if (dataview.columns) {

      dataview.Tabulator = new _xyz.utils.Tabulator(target, Object.assign({
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

        dataview.promise = _xyz.dataviews.query(dataview);

        dataview.promise.then(response => {

          dataview.Tabulator.setData(response.length && response || [response]);
          //dataview.Tabulator.redraw(true);

        });
      }

    }

    dataview.update();

    dataview.layer && _xyz.mapview.node && _xyz.mapview.node.addEventListener('changeEnd', () => {
      (dataview.target.classList.contains('active')
      || dataview.target.parentElement.classList.contains('active'))
      && dataview.update();
    });

    if (dataview.toolbar && dataview.viewport) toolbar.appendChild(_xyz.utils.wire()`
    <button
      class="off-white-hover primary-colour"
      onclick=${e => {
        e.target.classList.toggle('primary-colour');
        dataview.viewport = !dataview.viewport;
        dataview.update();
      }}>Viewport`)

    if (dataview.toolbar && dataview.download_csv) toolbar.appendChild(_xyz.utils.wire()`
    <button
      class="off-white-hover primary-colour"
      onclick=${() => {
        dataview.Tabulator.download('csv', `${dataview.title || 'table'}.csv`)
      }}>Viewport`)

    if (dataview.toolbar && dataview.download_json) toolbar.appendChild(_xyz.utils.wire()`
    <button
      class="off-white-hover primary-colour"
      onclick=${() => {
        dataview.Tabulator.download('json', `${dataview.title || 'table'}.json`)
      }}>Viewport`)

    return dataview;

  }

}