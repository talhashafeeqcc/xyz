import cakeChart from './cakeChart.mjs';

import radarChart from './radarChart.mjs';

import polarChart from './polarChart.mjs';

import scatterplot from './scatterplot.mjs';

import simpleChart from './simpleChart.mjs';

import stackedChart from './stackedChart.mjs';

export default _xyz => {

  const charts = {

    create: create,

    cake: cakeChart(_xyz),

    polarArea: polarChart(_xyz),

    radar: radarChart(_xyz),

    scatter: scatterplot(_xyz),

    simple: simpleChart(_xyz),

    stackedChart: stackedChart(_xyz),

    scale: scale,

    units: units,

    fallbackStyle: {
      borderColor: '#1F964D',
      backgroundColor: '#cae0b8'
    }
  }

  return charts;

  function create(chart) {

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

    // if (!entry.chart.type) {
    //   entry.chart.type = 'line';
    //   return charts.simple(entry);
    // }

    // if (entry.chart.type === 'mixed') entry.chart.type = 'bar';

    // if (entry.chart.type === 'line' || entry.chart.type === 'bar' || entry.chart.type === 'horizontalBar') return charts.simple(entry);

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

    if (['horizontalBar'].includes(chart.type)) {

      chart.setData = response => {

        chart.ChartJS.data = {
          labels: chart.labels,
          datasets: chart.datasets.map(dataset =>({
            data: dataset.fields.map(field => response[field]),
            backgroundColor: dataset.backgroundColor === 'random' && dataset.fields.map(() => _xyz.utils.Chroma.random().hex()) || dataset.backgroundColor,
            borderWidth: dataset.borderWidth,
            borderColor: dataset.borderColor === 'random' && dataset.fields.map(() => _xyz.utils.Chroma.random().hex()) || dataset.borderColor,
          }))
        }

      }
    }

    return chart;

    // if (entry.chart.type === 'pie' || entry.chart.type === 'doughnut') return charts.cake(entry);

    // if (entry.chart.type === 'polarArea') return charts.polarArea(entry);

    // if (entry.chart.type === 'radar') return charts.radar(entry);

    // if (entry.chart.type === 'scatter') return charts.scatter(entry);

    // if (entry.chart.type === 'stackedBar' || entry.chart.type === 'stackedHorizontalBar' || entry.chart.type === 'stackedLine') return charts.stackedChart(entry);

  }

  function scale(entry) {
    let _scale;

    switch (entry.chart.unit) {
      case 'k': _scale = '1k = 1 000'; break;
      case 'M': _scale = '1M = 1 000 000'; break;
    }

    return _scale;
  }

  function units(entry, label) {
    let _label;

    switch (entry.chart.unit) {
      case 'k': _label = label / 1000 + 'k'; break;
      case 'M': _label = label / 1000000 + 'M'; break;
    }

    return _label;
  }

};