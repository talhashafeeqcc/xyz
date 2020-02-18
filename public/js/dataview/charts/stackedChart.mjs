export default _xyz => entry => {

  const graph = _xyz.utils.wire()`<div style="position: relative;">`;

  const canvas = _xyz.utils.wire()`<canvas>`;

  canvas.setAttribute("height", entry.chart.height || 150);
  canvas.setAttribute("width", entry.chart.width || 350);

  canvas.style.height = `${entry.chart.height ? entry.chart.height : 150}px`;
  canvas.style.width = `${entry.chart.width ? entry.chart.width : 350}px`;

  graph.appendChild(canvas);

  if(!entry.chart.datalabels) {
    _xyz.utils.Chart.defaults.global.plugins.datalabels.display = false;
  }

  let chartType;

  if(entry.chart.type === 'stackedBar') chartType = 'bar';
  if(entry.chart.type === 'stackedHorizontalBar') chartType = 'horizontalBar';
  if(entry.chart.type === 'stackedLine') chartType = 'line';


  new _xyz.utils.Chart(canvas, {
    	type: chartType,
    	data: {
    		labels: entry.chart.labels,
    		datasets: entry.chart.datasets
    	},
    	options: {
    		title: {
    			display: entry.chart.title || false,
    			position: 'bottom',
    			text: entry.label
    		},
    		responsive: entry.chart.responsive === undefined ? true : false,
    		legend: {
    			display: entry.chart.legend,
    			position: entry.chart.legendPosition || 'left',
    			labels: {
    				boxWidth: 30
    			}
    		},
    		scales: {
    			yAxes: [{
    				ticks: {
    					beginAtZero: entry.chart.beginAtZero || false,
    					callback: (label, index, labels) => {
    						return entry.chart.unit ? _xyz.dataview.charts.units(entry, label) : label;
    					}
    				},
    				scaleLabel: {
    					display: (entry.chart.unit ? true : false),
    					labelString: (entry.chart.units ? _xyz.dataview.charts.scale(entry) : false)
    				},
    				stacked: true

    			}],
    			xAxes: [{
    				stacked: true
    			}]
    		},
    		tooltips: {
    			mode: 'index',
    			xAlign: entry.chart.xAlign || null,
    			yAlign: entry.chart.yAlign || null,
    			callbacks: {
    				title: () => ''
    			}
    		}
    	}
  });

  return graph;
};