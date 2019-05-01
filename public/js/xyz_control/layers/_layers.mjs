import format_mvt from './format/mvt.mjs';

import format_geojson from './format/geojson.mjs';

import legend_polyCategorized from './legend/polyCategorized.mjs';

import legend_polyGraduated from './legend/polyGraduated.mjs';

import format_cluster from './format/cluster.mjs';

import legend_clusterCategorized from './legend/clusterCategorized.mjs';

import legend_clusterGraduated from './legend/clusterGraduated.mjs';

import format_tiles from './format/tiles.mjs';

import format_grid from './format/grid.mjs';

import legend_grid from './legend/grid.mjs';

export default _xyz => {

  return {

    layer: layer,

  };

  function layer(key) {

    const layer = _xyz.workspace.locale.layers[key];

    layer.tableCurrent = () => {

      if (!layer.tables) return layer.table;

      let
        table,
        zoom = _xyz.map.getZoom(),
        zoomKeys = Object.keys(layer.tables),
        minZoomKey = parseInt(zoomKeys[0]),
        maxZoomKey = parseInt(zoomKeys[zoomKeys.length - 1]);
            
      table = layer.tables[zoom];

      table = zoom < minZoomKey ? layer.tables[minZoomKey] : table;

      table = zoom > maxZoomKey ? layer.tables[maxZoomKey] : table;

      if (layer.drawer) layer.drawer.style.opacity = !table ? 0.4 : 1;

      if (layer.loader && !table) layer.loader.style.display = 'none';

      return table;

    };

    layer.tableMin = () => {

      if (!layer.tables) return layer.table;

      let zoomKeys = Object.keys(layer.tables);

      return layer.tables[zoomKeys[0]] || layer.tables[zoomKeys[1]];

    };

    layer.tableMax = () => {

      if (!layer.tables) return layer.table;

      let zoomKeys = Object.keys(layer.tables);

      return layer.tables[zoomKeys[zoomKeys.length-1]] || layer.tables[zoomKeys[zoomKeys.length-2]];

    };

    layer.show = () => {
      layer.display = true;
      layer.loaded = false;
      layer.get();
      _xyz.mapview.attribution.check();
    };

    layer.remove = () => {
      layer.display = false;
      layer.loaded = false;
      if (layer.L) _xyz.map.removeLayer(layer.L);
      if (layer.attribution) _xyz.mapview.attribution.remove(layer.attribution);
      _xyz.mapview.attribution.check();
    };

    if (layer.hover) {

      function mousemove(e) {
        if (!layer.hover.tooltip) return;
        layer.hover.tooltip.style.left = (e.clientX - (layer.hover.tooltip.offsetWidth / 2)) + 'px';
        layer.hover.tooltip.style.top = (e.clientY - 15 - layer.hover.tooltip.offsetHeight) + 'px';
      };

      layer.hover.remove = () => {
        if (!layer.hover.tooltip) return;
        layer.hover.tooltip.remove();
        delete layer.hover.tooltip;
        document.body.removeEventListener('mousemove', mousemove);
      };

      layer.hover.add = eOrg => {

        layer.hover.remove();

        layer.hover.tooltip = _xyz.utils.hyperHTML.wire()`
        <div style="
        position: fixed;
        margin: 0;
        padding: 5px;
        background: #eee;
        box-shadow: 2px 2px 2px #666;
        transition-property: opacity;
        transition-duration: 0.3s;
        transition-delay: 0.2s;
        opacity: 0;
        z-index: 9999">`;

        const xhr = new XMLHttpRequest();

        xhr.open(
          'GET',
          _xyz.host +
          '/api/location/field?' +
          _xyz.utils.paramString({
            locale: _xyz.workspace.locale.key,
            layer: layer.key,
            table: layer.table,
            id: eOrg.id,
            field: layer.hover.field,
            token: _xyz.token
          }));
    
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.responseType = 'json';
    
        xhr.onload = e => {
    
          if (e.target.status !== 200 || !layer.hover.tooltip) return;
    
          layer.hover.tooltip.innerHTML = e.target.response.field;

          document.body.appendChild(layer.hover.tooltip);

          layer.hover.tooltip.style.left = (eOrg.x - (layer.hover.tooltip.offsetWidth / 2)) + 'px';
          layer.hover.tooltip.style.top = (eOrg.y - 15 - layer.hover.tooltip.offsetHeight) + 'px';
          layer.hover.tooltip.style.opacity = 1;

          document.body.addEventListener('mousemove', mousemove);
    
        };
    
        xhr.send();

      };

    }

    if (!layer.format) return;

    if (!layer.key) return;

    layer.selected = [];

    // Create empty legend container.
    if (layer.style) {
      layer.style.legend = _xyz.utils.createElement({
        tag: 'div',
        options: {
          classList: 'legend'
        }
      });

      layer.style.setLegend = dom => {
        layer.style.getLegend();
        dom.appendChild(layer.style.legend);
      };

      layer.style.getLegend = () => {

        if(!layer.style.theme && layer.format != 'grid') return;

        if (layer.format === 'mvt' && layer.style.theme.type === 'categorized') legend_polyCategorized(_xyz, layer);

        if (layer.format === 'mvt' && layer.style.theme.type === 'graduated') legend_polyGraduated(_xyz, layer);

        if (layer.format === 'cluster' && layer.style.theme.type === 'categorized') legend_clusterCategorized(_xyz, layer);

        if (layer.format === 'cluster' && layer.style.theme.type === 'competition') legend_clusterCategorized(_xyz, layer);

        if (layer.format === 'cluster' && layer.style.theme.type === 'graduated') legend_clusterGraduated(_xyz, layer);

        if (layer.format === 'grid') legend_grid(_xyz, layer);

      };

      if (layer.style.themes) layer.style.theme = layer.style.themes[Object.keys(layer.style.themes)[0]];

      if (layer.style.themes) layer.style.setTheme = theme => {
        layer.style.theme = layer.style.themes[theme];
        layer.show();
      };

    }
   
    if (layer.format === 'mvt') layer.get = format_mvt(_xyz, layer);

    if (layer.format === 'geojson') layer.get = format_geojson(_xyz, layer);

    if (layer.format === 'cluster') layer.get = format_cluster(_xyz, layer);

    if (layer.format === 'tiles') layer.get = format_tiles(_xyz, layer);

    if (layer.format === 'grid') layer.get = format_grid(_xyz, layer);

    return layer;

  }

};