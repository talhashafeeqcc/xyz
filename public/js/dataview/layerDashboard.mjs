export default _xyz => dashboard => {

	if(!dashboard || !dashboard.dataviews) return;

	if (_xyz.dataview.node) document.body.style.gridTemplateRows = 'minmax(0, 1fr) 40px';

	if (_xyz.dataview.tables.indexOf(dashboard) < 0) _xyz.dataview.tables.push(dashboard);

	if (_xyz.dataview.nav_bar) _xyz.dataview.addTab(dashboard);

	dashboard.update = () => {

		if(document.querySelector('.tab-content')) document.querySelector('.tab-content').innerHTML = '';

		if(dashboard.template) {

			// here dashboard from template
			const xhr = new XMLHttpRequest();

      xhr.open('GET', _xyz.host +
        '/view/' + encodeURIComponent(dashboard.template) + '?' +
        _xyz.utils.paramString({
          locale: _xyz.workspace.locale.key,
          layer: dashboard.layer.key,
          token: _xyz.token
        }));

			xhr.onload = e => {

				if (e.target.status !== 200) return;

				if(document.querySelector('.tab-content')) document.querySelector('.tab-content').innerHTML = e.target.response;

				Object.values(dashboard.dataviews || []).forEach(dataview => {

					if(!dataview.target_id) return;

					dataview.target = _xyz.utils.wire()`<div>`;

					_xyz.dataview.layerDataview(Object.assign({}, dataview, {layer: dashboard.layer}));

					let container = dataview.target_id ? document.getElementById(dataview.target_id) : null;

					if(container) container.appendChild(dataview.target);
				
				});
			
			}

			xhr.send();

		} else {

			Object.values(dashboard.dataviews || []).map(dataview => {

				dataview.target = _xyz.utils.wire()`<div>`;

				_xyz.dataview.layerDataview(Object.assign({}, dataview, {layer: dashboard.layer}));

				let container = dataview.target_id && document.getElementById(dataview.target_id) || document.querySelector('.tab-content');

				if(container) container.appendChild(dataview.target);
			
			});
		}

	}

	dashboard.activate = () => {

		dashboard.update();

		_xyz.dataview.current_table = dashboard;
	}

	if(!dashboard.tab || !dashboard.tab.classList.contains('folded')) dashboard.activate();

}