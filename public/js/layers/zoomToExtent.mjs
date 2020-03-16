export default _xyz => function (params) {

  const layer = this;
  
  // Request to get the extent of layer data.
  const xhr = new XMLHttpRequest();

  // Create filter from legend and current filter.
  //  layer.filter && layer.filter.current && Object.keys(layer.filter.current).map(key => {
  //   if(Object.keys(layer.filter.legend).includes(key)) {
  //     layer.filter.current[key] = Object.assign({}, layer.filter.legend[key], layer.filter.current[key]);
  //   }
  // });

  const filter = layer.filter && Object.assign({}, layer.filter.legend, layer.filter.current);

  xhr.open('GET', _xyz.host + '/api/query?' +
    _xyz.utils.paramString({
      template: 'layer_extent',
      locale: _xyz.workspace.locale.key,
      srid: _xyz.mapview.srid,
      layer: layer.key,
      filter: JSON.stringify(filter),
      token: _xyz.token
    }));

  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.responseType = 'json';

  xhr.onload = e => {
    if (e.target.status !== 200) return;

    const bounds = /\((.*?)\)/.exec(e.target.response.box2d)[1].replace(/ /g, ',');

    _xyz.mapview.flyToBounds(bounds.split(',').map(coords => parseFloat(coords)), params);
    
  };

  xhr.send();
  
};