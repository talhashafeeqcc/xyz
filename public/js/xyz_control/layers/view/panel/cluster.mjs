export default (_xyz, layer) => {

  if (layer.format !== 'cluster') return;

  if (!layer.cluster_panel) return;

  // Create cluster panel and add to layer dashboard.
  const panel = _xyz.utils.createElement({
    tag: 'div',
    options: {
      classList: 'panel expandable'
    },
    appendTo: layer.view.dashboard
  });

  // Panel title / expander.
  _xyz.utils.createElement({
    tag: 'div',
    options: {
      className: 'btn_text cursor noselect',
      textContent: 'Cluster'
    },
    appendTo: panel,
    eventListener: {
      event: 'click',
      funct: e => {
        e.stopPropagation();
        _xyz.utils.toggleExpanderParent({
          expandable: panel,
          accordeon: true,
          scrolly: _xyz.desktop && _xyz.desktop.listviews,
        });
      }
    }
  });

  // Set timeout to debounce layer get on range input event.
  let timeout;

  // KMeans
  panel.appendChild(_xyz.utils.wire()`
  <div>
  <span>Minimum number of cluster (KMeans): </span>
  <span class="bold">${layer.cluster_kmeans}</span>
  <div class="range">
  <input
    type="range"
    min=1
    value=${parseInt(layer.cluster_kmeans * 100)}
    max=50
    step=1
    oninput=${e=>{
    layer.cluster_kmeans = parseInt(e.target.value) / 100;
    e.target.parentNode.previousElementSibling.textContent = e.target.value / 100;
    
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      timeout = null;
      layer.reload();
    }, 500);
  }}>`);


  // DBScan
  panel.appendChild(_xyz.utils.wire()`
  <div>
  <span>Maximum distance between locations in cluster (DBScan): </span>
  <span class="bold">${layer.cluster_dbscan}</span>
  <div class="range">
  <input
    type="range"
    min=1
    value=${parseInt(layer.cluster_dbscan * 100)}
    max=50
    step=1
    oninput=${e=>{
    layer.cluster_dbscan = parseInt(e.target.value) / 100;
    e.target.parentNode.previousElementSibling.textContent = e.target.value / 100;
    
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      timeout = null;
      layer.reload();
    }, 500);
  }}>`);


  //Create cluster_logscale checkbox.
  layer.cluster_logscale = layer.cluster_logscale || false;

  panel.appendChild(_xyz.utils.wire()`
  <label class="checkbox">Log scale cluster size.
  <input type="checkbox"
    checked=${layer.cluster_logscale ? true : false} 
    onchange=${e => {
    layer.cluster_logscale = e.target.checked;
    layer.get();
  }}>
  <div class="checkbox_i">`);

};