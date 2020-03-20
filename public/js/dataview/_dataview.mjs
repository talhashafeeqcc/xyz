import charts from './charts/_charts.mjs';

import create from './create.mjs';

import query from './query.mjs';

import addTab from './addTab.mjs';

import removeTab from './removeTab.mjs';

import dashboard from './dashboard.mjs';

import layerDashboard from './layerDashboard.mjs';

import layerDataview from './layerDataview.mjs';

import resizeObserve from './resizeObserve.mjs';

export default _xyz => {

  return {

    tables: [],

    query: query(_xyz),

    charts: charts(_xyz),
    
    create: create(_xyz),

    addTab: addTab(_xyz),

    removeTab: removeTab(_xyz),

    dashboard: dashboard(_xyz),

    layerDashboard: layerDashboard(_xyz),

    layerDataview: layerDataview(_xyz),

    resizeObserve: resizeObserve(_xyz)

  };
    
};