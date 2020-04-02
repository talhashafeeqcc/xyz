export default _xyz => chart => {

  chart.div = _xyz.utils.wire()`<div style="position: relative;">`;

  const canvas = _xyz.utils.wire()`<canvas>`;

  chart.div.appendChild(canvas);

  if (!chart.datalabels) {
    _xyz.utils.Chart.defaults.global.plugins.datalabels.display = false;
  }

  chart.ChartJS = new _xyz.utils.Chart(canvas, {
    type: chart.type,
    options: {
      legend: {
        display: false
      }
    }
  });

  chart.options && Object.assign(chart.ChartJS.options, chart.options);

  chart.setData = response => {

    chart.ChartJS.data = {
      labels: chart.labels,
      datasets: chart.datasets.map(dataset => ({
        data: dataset.fields && dataset.fields.map(field => response[field]) || dataset.field && response[dataset.field] || response,
        fill: dataset.fill,
        backgroundColor: ()=>color(dataset.backgroundColor, dataset, response),
        borderWidth: dataset.borderWidth,
        borderColor: ()=>color(dataset.borderColor, dataset, response),
      })
      )
    }

  }

  function color(_color, dataset, response) {

    if (typeof _color === 'undefined') return _color;

    if (_color && _color !== 'random') return _color;

    if (dataset.fields) return dataset.fields.map(() => _xyz.utils.Chroma.random().hex());

    if (response.length) return response.map(() => _xyz.utils.Chroma.random().hex());

  }

  return chart;

}