const params = {};

// Take hooks from URL and store as current hooks.
window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, (match, key, value) => {
  params[key] = decodeURI(value);
});

_xyz({
  host: document.head.dataset.host,
  token: document.body.dataset.token,
  locale: params.locale,
  callback: init
});

function init(_xyz) {

  _xyz.mapview.create({
    scrollWheelZoom: true,
    showScaleBar: 'never',
    target: document.getElementById('xyz_map')
  });

  setLocation(_xyz, location => {
    document.getElementById('xyz_location').appendChild(_xyz.locations.view.infoj(location))
    _xyz.map.updateSize();
    location.flyTo();
  });

}

function setLocation(_xyz, callback){

  _xyz.locations.select({
    locale: params.locale,
    layer: _xyz.layers.list[params.layer],
    table: params.table,
    id: params.id,
    callback: location => {

      _xyz.locations.decorate(location);

      // Required for streetview fields.
      location.marker = _xyz.utils.turf.pointOnFeature(location.geometry).geometry.coordinates;

      location.draw();

      // Draw location marker.
      location.Marker = _xyz.mapview.geoJSON({
        geometry: {
          type: 'Point',
          coordinates: location.marker,
        },
        style: new _xyz.mapview.lib.style.Style({
          image: _xyz.mapview.icon({
            type: 'markerColor',
            colorMarker: '#1F964D',
            colorDot: '#fff',
            scale: 0.05,
            anchor: [0.5, 1]
          })
        }),
        dataProjection: location.layer.srid,
        featureProjection: _xyz.mapview.srid
      });

      _xyz.mapview.interaction.current.finish();

      callback && callback(location);

    }
  });
  
}

_xyz({
  host: document.head.dataset.host,
  token: document.body.dataset.token,
  locale: params.locale,
  callback: _xyz => {

    _xyz.mapview.create({
      scrollWheelZoom: true,
      showScaleBar: 'never',
      target: document.getElementById('xyz_map1')
    });

    _xyz.layers.list['Existing Terminals'].remove();
    _xyz.layers.list['Future Terminals'].remove();

    setLocation(_xyz, location => {
      _xyz.map.updateSize();
      _xyz.locations.view.infoj(location);
      location.flyTo();
      _xyz.layers.list['Demand'].style.theme = _xyz.layers.list['Demand'].style.themes['DBG Demand'];
      _xyz.layers.list['Demand'].show();
    });

    document.getElementById('legend-dbg-demand').appendChild(_xyz.layers.view.style.legend(_xyz.layers.list['Demand']));
  }
});

_xyz({
  host: document.head.dataset.host,
  token: document.body.dataset.token,
  locale: params.locale,
  callback: _xyz => {

    _xyz.mapview.create({
      scrollWheelZoom: true,
      showScaleBar: 'never',
      target: document.getElementById('xyz_map2')
    });

    _xyz.layers.list['Existing Terminals'].remove();
    _xyz.layers.list['Future Terminals'].remove();

    setLocation(_xyz, location => {
      _xyz.map.updateSize();
      _xyz.locations.view.infoj(location);
      location.flyTo();
      _xyz.layers.list['Demand'].style.theme = _xyz.layers.list['Demand'].style.themes['IWG Demand'];
      _xyz.layers.list['Demand'].show();
    });

    document.getElementById('legend-iwg-demand').appendChild(_xyz.layers.view.style.legend(_xyz.layers.list['Demand']));
  }
});

_xyz({
  host: document.head.dataset.host,
  token: document.body.dataset.token,
  locale: params.locale,
  callback: _xyz => {

    _xyz.mapview.create({
      scrollWheelZoom: true,
      showScaleBar: 'never',
      target: document.getElementById('xyz_map3')
    });

    _xyz.layers.list['Existing Terminals'].remove();
    _xyz.layers.list['Future Terminals'].remove();

    setLocation(_xyz, location => {
      _xyz.map.updateSize();
      _xyz.locations.view.infoj(location);
      location.flyTo();
      _xyz.layers.list['Demand'].style.theme = _xyz.layers.list['Demand'].style.themes['Online Demand'];
      _xyz.layers.list['Demand'].show();

      document.getElementById('legend-online-demand').appendChild(_xyz.layers.view.style.legend(_xyz.layers.list['Demand']));
    });
  }
});