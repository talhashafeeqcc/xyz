export default _xyz => dashboard => {

	if(!dashboard || !dashboard.dataviews) return;

	if (_xyz.dataview.node) document.body.style.gridTemplateRows = 'minmax(0, 1fr) 40px';

	if (_xyz.dataview.tables.indexOf(dataview) < 0) _xyz.dataview.tables.push(dashboard);

	if (_xyz.dataview.nav_bar) _xyz.dataview.addTab(dashboard);

	dashboard.update = () => {

		document.querySelector('.tab-content').innerHTML = '';

		if(dashboard.template) {

			// here dashboard from template

		} else {

			Object.values(dashboard.dataviews || []).map(dataview => {

				dataview.dataview = _xyz.utils.wire()`<div>`;

				_xyz.dataview.layerDataview(Object.assign({}, dataview, {layer: dashboard.layer}));

				document.querySelector('.tab-content').appendChild(dataview.dataview);
			
			});
		}

	}

	dashboard.activate = () => {

		dashboard.update();

		_xyz.dataview.current_table = dashboard;
	}

	if(!dashboard.tab || !dashboard.tab.classList.contains('folded')) dashboard.activate();

}