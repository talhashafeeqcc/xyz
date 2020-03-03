export default _xyz => entry => {

  if (!entry.report.template) return;

  const href = _xyz.host + '/view/' + encodeURIComponent(entry.report.template) + '?' + _xyz.utils.paramString(
    Object.assign(
      entry.report,
      {
        locale: _xyz.workspace.locale.key,
        layer: entry.location.layer.key,
        table: entry.location.table,
        id: entry.location.id,
        token: _xyz.token
      }
    )
  );

  entry.listview.appendChild(_xyz.utils.wire()`
    <div style="grid-column: 1 / span 2;">
    <a class="primary-colour" target="_blank" href="${href}">${entry.report.name || 'Location Report'}`);

};