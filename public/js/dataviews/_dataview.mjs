import tabview from './tabview.mjs';

import query from './query.mjs';

import chart from './chart.mjs';

import dataview from './dataview.mjs';

export default _xyz => {

  return {

    query: query(_xyz),

    chart: chart(_xyz),
    
    tabview: tabview(_xyz),

    dataview: dataview(_xyz),

  };
    
};