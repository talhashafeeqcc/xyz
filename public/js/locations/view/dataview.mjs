export default _xyz => entry => {

    if (!entry.query) return;

    const xhr = new XMLHttpRequest();

    xhr.open('GET', _xyz.host + '/api/query?' + _xyz.utils.paramString({

        locale: _xyz.workspace.locale.key,
        layer: entry.location.layer.key,
        id: entry.location.id,
        template: entry.query,
        token: _xyz.token

    }));

    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.responseType = 'json';

    xhr.onload = e => {

        if (e.target.status !== 200) return;

        // get data from response based on fields setup
        Object.values(entry.chart.datasets || []).map(dataset => {

          dataset.data = [];
            
            dataset.fields
            .map(f => { 
              Array.isArray(e.target.response[f]) ? dataset.data = e.target.response[f] : dataset.data.push(Number(e.target.response[f]));
            });

        });

        const dataview = _xyz.dataview.charts.create(entry);

        entry.dataview.appendChild(dataview);

        return entry;
    }

    xhr.send();

};