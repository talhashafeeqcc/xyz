export default _xyz => entry => {

    const graph = _xyz.utils.wire()
    `<div style="position: relative;">`;

    const canvas = _xyz.utils.wire()
    `<canvas>`;

    canvas.setAttribute("height", entry.chart.height || 150);

    canvas.setAttribute("width", entry.chart.width || 350);

    canvas.style.height = `${entry.chart.height ? entry.chart.height : 150}px`;
    canvas.style.width = `${entry.chart.width ? entry.chart.width : 350}px`;

    graph.appendChild(canvas);

    if (!entry.chart.datalabels) {
        _xyz.utils.Chart.defaults.global.plugins.datalabels.display = false;
    }

    //Apply offsetX
    entry.chart.datasets && entry.chart.offsetX && entry.chart.datasets.map(dataset => {
      dataset.data = dataset.data.map(d => { return d + (entry.chart.offsetX || 0) });
    });

    // Apply negative colours if defined
    if (entry.chart.negativeBackgroundColor || entry.chart.negativeBorderColor) {

        let bgColors = [],
            bdColors = [];

        Object.values(entry.chart.datasets).map(dataset => {

            dataset.data.map(d => {
                d > 0 ? bgColors.push(entry.chart.backgroundColor || _xyz.dataview.charts.fallbackStyle.backgroundColor) : bgColors.push(entry.chart.negativeBackgroundColor || _xyz.dataview.charts.fallbackStyle.borderColor);
                d > 0 ? bdColors.push(entry.chart.backgroundColor || _xyz.dataview.charts.fallbackStyle.backgroundColor) : bdColors.push(entry.chart.negativeBackgroundColor || _xyz.dataview.charts.fallbackStyle.borderColor);
            });

            dataset.backgroundColor = bgColors;
            dataset.borderColor = bdColors;

        });

    }

    // sets datalabels and applies offset back
    if (entry.chart.datalabels) {

        _xyz.utils.Chart.defaults.global.plugins.datalabels.display = true;

        Object.values(entry.chart.datasets).map(dataset => {

            dataset.datalabels = {
                align: 'right',
                anchor: 'end',
                formatter: (item, data) => { // uses offsetX data in labelling
                    let idx = data.dataIndex;
                    return dataset.data[idx] - (entry.chart.offsetX || 0);
                }
            }

        });
    }

    const title = {
        display: entry.chart.title || false,
        position: 'bottom',
        text: entry.label
    };

    new _xyz.utils.Chart(canvas, {
        type: entry.chart.type,
        data: {
            labels: entry.chart.labels || [],
            datasets: entry.chart.datasets
        },
        options: {
            layout: entry.chart.layout ? entry.chart.layout : null,
            title: (entry.chart.title && typeof(entry.chart.title) === 'object' ? entry.chart.title : title),
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
                    afterFit: (scaleInstance) => {
                        if (entry.chart.yAxesWidth) scaleInstance.width = entry.chart.yAxesWidth;
                    },
                    gridlines: {
                        display: true
                    },
                    ticks: {
                        beginAtZero: entry.chart.beginAtZero || false,
                        callback: (label, index, labels) => {
                            return entry.chart.unit ? _xyz.dataview.charts.units(entry, label) : label;
                        }
                    }
                }],
                xAxes: [{
                    ticks: {
                        min: entry.chart.minX !== undefined ? entry.chart.minX : null,
                        display: entry.chart.hideTicksX === undefined ? true : false,
                        maxRotation: entry.chart.maxRotationX || null,
                        minRotation: entry.chart.minRotationX || null
                    }
                }]
            },
            tooltips: {
                mode: 'index',
                xAlign: entry.chart.xAlign || null,
                yAlign: entry.chart.yAlign || null,
                callbacks: {
                    title: () => '',
                    label: item => {
                        return Number(entry.chart.offsetX) ? `${item.yLabel}: ${item.xLabel -= entry.chart.offsetX}` : `${item.yLabel}: ${item.xLabel}`;
                    }
                }
                /*,
                          filter: tooltipItem => {}*/
            }
        }
    });

    return graph;

};