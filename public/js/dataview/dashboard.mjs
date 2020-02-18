export default _xyz => (entry, callback) => {

  if (!entry || !entry.location) return;

  if (_xyz.dataview.node) document.body.style.gridTemplateRows = 'minmax(0, 1fr) 40px';

  if (_xyz.dataview.tables.indexOf(entry) < 0) _xyz.dataview.tables.push(entry);

  if (_xyz.dataview.nav_bar) _xyz.dataview.addTab(entry);

  entry.update = () => {

    entry.target.innerHTML = '';
    // this destroys html in the app before refresh but shouldn't happen in report.
    //if(!document.getElementById(entry.target_id)) entry.target.innerHTML = ''; 

    Object.values(entry.dataviews || []).map(dataview => {

      dataview.dataview = _xyz.utils.wire()`<div>`;
      
      _xyz.locations.view.dataview(Object.assign({
        location: {
          layer: {
            key: entry.location.layer.key
          },
          id: entry.location.id
        }
      }, dataview));

      document.querySelector('.tab-content').appendChild(dataview.dataview);
    
    });

  };

  entry.activate = () => {

    entry.update();

    _xyz.dataview.current_table = entry;

  };

  // active only if displayed in the navbar 
  if(!entry.tab || !entry.tab.classList.contains('folded')) entry.activate();

};