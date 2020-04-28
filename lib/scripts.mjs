if (dataview.script) {

  const script = _xyz.utils.wire()`<script src="${dataview.script}">`;

  function addDashboard(e) {
    e.detail(_xyz, dataview);
    document.removeEventListener('addDashboard', addDashboard);
    script.remove();
  }

  document.addEventListener('addDashboard', addDashboard, true);

  dataview.target.appendChild(script);

  return;
}