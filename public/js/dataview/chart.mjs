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

  if (['bubble'].includes(chart.type)) {
   
    chart.setData = response => {

      chart.ChartJS.data = {
        datasets: chart.datasets.map(dataset => ({
          data: response.map(field => ({
            x: field[dataset.x],
            y: field[dataset.y],
            r: field[dataset.r]
          })),
          backgroundColor: dataset.backgroundColor === 'random' && response.map(() => _xyz.utils.Chroma.random().hex()) || dataset.backgroundColor,
          borderWidth: dataset.borderWidth,
          borderColor: dataset.borderColor === 'random' && response.map(() => _xyz.utils.Chroma.random().hex()) || dataset.borderColor,
        }))
      }

    }
  }

  if (['horizontalBar', 'bar', 'doughnut', 'radar'].includes(chart.type)) {

    chart.setData = response => {

      chart.ChartJS.data = {
        labels: chart.labels,
        datasets: chart.datasets.map(dataset =>({
          data: dataset.fields && dataset.fields.map(field => response[field]) || response[dataset.field],
          fill: dataset.fill,
          backgroundColor: dataset.backgroundColor === 'random' && dataset.fields.map(() => _xyz.utils.Chroma.random().hex()) || dataset.backgroundColor,
          borderWidth: dataset.borderWidth,
          borderColor: dataset.borderColor === 'random' && dataset.fields.map(() => _xyz.utils.Chroma.random().hex()) || dataset.borderColor,
        }))
      }

    }
  }

  return chart;

}