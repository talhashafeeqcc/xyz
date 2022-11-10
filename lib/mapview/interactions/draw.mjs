let _this;

export default function(params){

  // Finish the current interaction.
  this.interaction?.finish()

  // The callback method from the previous call might have assigned another interaction.
  this.interaction?.finish()

  // Assign params onto the defaults as _this.
  _this = Object.assign({

    // Interactions are bound to the mapview as this.
    mapview: this,

    type: 'draw',

    finish,

    getFeature,
  
    format: new ol.format.GeoJSON(),

    source: new ol.source.Vector(),
  
    Layer: new ol.layer.Vector(),

    // Bind context menu from mapp ui elements.
    contextMenu: mapp.ui?.elements.contextMenu.draw.bind(this),

    vertices: [],

    // Whether the draw interaction event should be handled.
    condition: e => {

      // A vertice may not be set if kinks were detected on the geometry.
      if (_this.kinks) return false;

      // Left click.
      if (e.originalEvent.buttons === 1) {

        _this.vertices.push(e.coordinate);
        _this.mapview.popup(null);
        
        _this.conditions?.forEach(fn => typeof fn === 'function' && fn(e))
        return true;
      }
    },
  
    // OL Style for sketch feature.
    style: [
      new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: '#3399CC',
          width: 1.25
        })
      }),
      new ol.style.Style({
        image: new ol.style.Circle({
          radius: 5,
          fill: new ol.style.Fill({
            color: '#eee',
          }),
          stroke: new ol.style.Stroke({
            color: '#3399CC',
            width: 1.25
          })
        }),
        geometry: mapp.utils.verticeGeoms
      })
    ]
  }, params)

  // Set _this to be the current mapview interaction.
  _this.mapview.interaction = _this  
  
  // Change cursor style for mapview element.
  _this.mapview.Map.getTargetElement().style.cursor = 'crosshair'

  _this.Layer.setSource(params.source || _this.source)
  
  // Add draw layer to mapview.
  _this.mapview.Map.addLayer(_this.Layer)
  
  // Create OL draw interaction.
  _this.interaction = new ol.interaction.Draw(_this)

  // Set drawstart event method.
  _this.interaction.on('drawstart', e => {

    const geometry = e.feature.getGeometry()

    async function onChange() {
      _this.mapview.popup({
        content: mapp.utils.html.node`
          <div style="padding: 5px">${await mapp.utils.convert(_this.mapview.metrics[_this.tooltip.metric](geometry), _this.tooltip)}`
      })
    }

    _this.tooltip && geometry.on('change', _this.tooltip.onChange || onChange)

    e.feature.setStyle(_this.style)

    _this.source.clear()

    _this.mapview.popup(null)
  })
  
  _this.interaction.on('drawend', e => {

    if (_this.drawend) return _this.drawend(e);

    typeof _this.contextMenu === 'function' && setTimeout(_this.contextMenu, 400);
  })
  
  // Add OL interaction to mapview.Map
  _this.mapview.Map.addInteraction(_this.interaction)

  _this.snap && _this.mapview.interactions.snap(_this)

  if (typeof _this.contextMenu === 'function') {

    _this.mapview.Map.getTargetElement()
      .addEventListener('contextmenu', _this.contextMenu)
  }
 
  function getFeature() {
  
    // Get OL feature from _this.Layer source.
    const features = _this.source.getFeatures()
    
    // Return feature as geojson.
    return JSON.parse(
      _this.format.writeFeature(
        features[0],
        { 
          dataProjection: 'EPSG:' + _this.srid || _this.mapview.srid,
          featureProjection: 'EPSG:' + _this.mapview.srid
        })
    )
  }
  
  function finish(feature) {

    // Set the current interaction to null.
    _this.mapview.interaction = null

    // Remove snap interaction from mapview.
    _this.snap && _this.mapview.interactions.snap(null)
  
    // Execute callback if defined as function.
    typeof _this.callback === 'function' && _this.callback(feature)
  
    // Remove popup from mapview.
    _this.mapview.popup(null)
  
    // Remove context menu from mapview.
    if (typeof _this.contextMenu === 'function') {

      _this.mapview.Map.getTargetElement()
        .removeEventListener('contextmenu', _this.contextMenu)
    }
  
    // Remove interaction from OL Map.
    _this.mapview.Map.removeInteraction(_this.interaction)
  
    // Remove draw layer from mapview.
    _this.mapview.Map.removeLayer(_this.Layer)
  
    // Clear draw layer source.
    _this.source.clear()
  
    // Reset the cursor style.
    _this.mapview.Map.getTargetElement().style.cursor = 'default'
  }

}