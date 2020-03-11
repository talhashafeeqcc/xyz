export default _xyz => e => {

		//e.preventDefault();
		e.stopPropagation();

		_xyz.mapview.node.style.cursor = 'crosshair';

		_xyz.mapview.interaction.zoom = {};

		_xyz.mapview.interaction.zoom.Source = new _xyz.mapview.lib.source.Vector();

		_xyz.mapview.interaction.zoom.Layer = new _xyz.mapview.lib.layer.Vector({
			source: _xyz.mapview.interaction.zoom.Source
		});

		_xyz.map.addLayer(_xyz.mapview.interaction.zoom.Layer);

		_xyz.mapview.interaction.zoom.interaction = new _xyz.mapview.lib.interaction.Draw({
		 	source: _xyz.mapview.interaction.zoom.Source,
		 	type: 'Circle',
		 	geometryFunction: _xyz.mapview.lib.draw.createBox()
		});

		_xyz.mapview.interaction.zoom.interaction.on('drawstart', e => {

			//e.preventDefault();
			e.stopPropagation();

			e.feature.setStyle(
				new _xyz.mapview.lib.style.Style({
					stroke: new _xyz.mapview.lib.style.Stroke({
					    color: '#1f964d', // this stroke style won't set
					    width: 1
				    }),
					fill: false
				}));
		});

		_xyz.mapview.interaction.zoom.interaction.on('drawend', e => {

			let area = e.feature;

			_xyz.mapview.node.style.cursor = '';

			_xyz.mapview.flyToBounds(area.getGeometry().getExtent());

			_xyz.map.removeInteraction(_xyz.mapview.interaction.zoom.interaction);

			setTimeout(() => {
				_xyz.mapview.interaction.zoom.Source.clear();
				_xyz.map.removeLayer(_xyz.mapview.interaction.zoom.Layer)
			}, 500);
		});

		_xyz.map.addInteraction(_xyz.mapview.interaction.zoom.interaction);

}