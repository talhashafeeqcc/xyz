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

  new _xyz.utils.Chart(canvas, {
    	type: entry.chart.type,
    	data: {
    		labels: entry.chart.labels,
    		datasets: entry.chart.datasets  		
    	},
    	options: {
    		cutoutPercentage: entry.chart.type === 'doughnut' ? (entry.chart.cutoutPercentage || 50) : null,
    		title: {
    			display: entry.chart.title || false,
    			position: 'bottom',
    			text: entry.label
    		},
    		responsive: entry.chart.responsive === undefined ? true : false,
    		legend: {
    			display: entry.chart.legend || false,
        position: entry.chart.legendPosition || 'left',
        labels: {
          boxWidth: 30
        }
    		},
    		scales: {
    			yAxes: [],
    			xAxes: []
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