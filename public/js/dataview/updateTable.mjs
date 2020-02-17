export default _xyz => () => {

  const xhr = new XMLHttpRequest();

  const bounds = _xyz.mapview && _xyz.mapview.getBounds();

  const filter = table.layer.filter && Object.assign({}, table.layer.filter.legend, table.layer.filter.current);

  xhr.open('GET', _xyz.host + '/api/query?' + _xyz.utils.paramString({
    locale: _xyz.workspace.locale.key,
    srid: _xyz.mapview.srid,
    layer: table.layer.key,
    table: table.key,
    template: table.query,
    filter: JSON.stringify(filter),
    south: bounds && bounds.south,
    west: bounds && bounds.west,
    north: bounds && bounds.north,
    east: bounds && bounds.east,
    token: _xyz.token
  }));

  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.responseType = 'json';
  
  xhr.onload = e => {
  
    if (e.target.status !== 200) return;
    
    _xyz.dataview.current_layer.dataview.table.setData(e.target.response);

    _xyz.dataview.current_layer.dataview.table.redraw(true);

  };

  xhr.send();

};