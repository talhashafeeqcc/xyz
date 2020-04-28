console.log('hello');

_xyz({
  host: document.head.dataset.dir,
  hooks: true,
  callback: _xyz => {

    _xyz.mapview.create({
      target: document.getElementById('Map'),
      scrollWheelZoom: true,
      zoomControl: true
    });

    document.getElementById('btnLocate').onclick = e => {
      _xyz.mapview.locate.toggle();
      e.target.classList.toggle('active');
    };

    _xyz.locations.list = [
      {
        color: '#00AEEF',
        colorDark: '#007BBC',
        marker: {
          url: "https://cdn.jsdelivr.net/gh/GEOLYTIX/gla@latest/icon-pin_blue.svg",
          anchor: [0.5, 1],
          scale: 0.5
        },
      },
      {
        color: '#008D48',
        colorDark: '#005A15',
        marker: {
          url: "https://cdn.jsdelivr.net/gh/GEOLYTIX/gla@latest/icon-pin_green.svg",
          anchor: [0.5, 1],
          scale: 0.5
        },
      },
      {
        color: '#E85713',
        colorDark: '#CF3E00',
        marker: {
          url: "https://cdn.jsdelivr.net/gh/GEOLYTIX/gla@latest/icon-pin_orange.svg",
          anchor: [0.5, 1],
          scale: 0.5
        },
      }
    ];

    _xyz.locations.selectCallback = location => {

      // Draw location marker.
      location.Marker = _xyz.mapview.geoJSON({
        geometry: {
          type: 'Point',
          coordinates: location.marker,
        },
        style: new _xyz.mapview.lib.style.Style({
          image: _xyz.mapview.icon(location.record.marker)
        })
      });

      location.view = _xyz.utils.wire()`<div class="location" style="font-size: 14px; margin-top: 10px; border: 3px solid #2a709d;">`;
  
      const header = _xyz.utils.wire()`<div style="display: grid; grid-gap: 5px; grid-template-columns: auto 30px 30px;">`;

      location.view.appendChild(header);

      header.appendChild(_xyz.utils.wire()`<div style="grid-column: 1" class="title">Details`);

      const title_expand = _xyz.utils.wire()`<div style="grid-column: 2;" class="title-btn expander">`;

      header.appendChild(title_expand);

      const title_close = _xyz.utils.wire()`<div style="grid-column: 3;" class="title-btn exit">`;

      header.appendChild(title_close);

      title_expand.onclick = function (e) {

        const loc = e.target.parentNode.parentNode;

        loc.classList.toggle('collapsed');

      };

      title_close.onclick = function () {
        location.remove();
      };

      header.appendChild(_xyz.locations.view.infoj(location));

      document.getElementById('locationView').appendChild(location.view);

    };


    const layer = _xyz.layers.list['Care Homes'];
    

    // Locator
    _xyz.mapview.locate.icon = {
      url: "https://cdn.jsdelivr.net/gh/GEOLYTIX/gla@latest/icon-pin_locate.svg",
      anchor: [0.5, 1],
      scale: 0.5
    }


    // Gazetteer
    const input = document.getElementById('postcode-search');

    const find = document.getElementById('postcode-find');

    input.addEventListener('focus', e => {
      find.classList.remove('darkish');
      find.classList.add('pink-bg');
      e.target.parentNode.classList.add('pink-br');
    });

    input.addEventListener('blur', e => {
      find.classList.add('darkish');
      find.classList.remove('pink-bg');
      e.target.parentNode.classList.remove('pink-br');
    });

    _xyz.gazetteer.icon = {
      url: "https://cdn.jsdelivr.net/gh/GEOLYTIX/gla@latest/icon-pin_gazetteer.svg",
      anchor: [0.5, 1],
      scale: 0.5
    }

    find.addEventListener('click', () => {

      _xyz.gazetteer.search(input.value,
        {
          source: 'GOOGLE',
          callback: json => {

            if (json.length === 0) return alert('No results for this search.');

            _xyz.gazetteer.select(Object.assign(json[0]));

            // Zoom to extent of nearest 3 centre in callback.
            _xyz.gazetteer.select(Object.assign(json[0], {callback: res => {

              const xhr = new XMLHttpRequest();

              xhr.open('GET',
                _xyz.host + '/api/query?' +
                _xyz.utils.paramString({
                  template: 'get_nnearest',
                  locale: _xyz.workspace.locale.key,
                  layer: 'Care Homes',
                  table: 'dev.uk_carehomes',
                  n: 10,
                  coords: res.coordinates,
                  lng: res.coordinates[0],
                  lat: res.coordinates[1],
                  filter: JSON.stringify(layer.filter.current),
                }));

              xhr.setRequestHeader('Content-Type', 'application/json');
              xhr.responseType = 'json';

              xhr.onload = e => {

                if (e.target.status !== 200) return;

                console.log(e.target.response);

                let locationList = new _xyz.utils.Tabulator(document.getElementById('locationList'), {
                  data: e.target.response,
                  columns: [{
                    field: "id",
                    visible: false
                  },{
                    field: "label"
                  }],
                  layout: 'fitDataFill',
                  selectable: true,
                  rowClick: (e, row) => {
                    const rowData = row.getData();
                    if (!rowData.id) return;
                    _xyz.locations.select({
                      locale: _xyz.workspace.locale.key,
                      layer: layer,
                      table: layer.tableCurrent(),
                      id: rowData.id,
                      _flyTo: true
                    });
                    row.deselect();
                  }
                });

                //locationList.setData(e.target.response);

                const geoJSON = new _xyz.mapview.lib.format.GeoJSON();

                const features = [];

                e.target.response.forEach(f => {

                  features.push(geoJSON.readFeature({
                    type: 'Feature',
                    geometry: {
                      type: 'Point',
                      coordinates: f.coords
                    }
                  }, {
                    dataProjection: 'EPSG:4326',
                    featureProjection: 'EPSG:3857'
                  }));

                });

                const gazSource = _xyz.gazetteer.layer.getSource();

                gazSource.addFeatures(features);

                _xyz.mapview.flyToBounds(_xyz.gazetteer.layer.getSource().getExtent());

                features.forEach(f => gazSource.removeFeature(f));

              };

              xhr.send();

            }}));

          }
        }
      );
    });

  }
});

