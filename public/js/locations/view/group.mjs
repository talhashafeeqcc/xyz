export default _xyz => group => {

    if (!group.label) return;

    // check if group has any data
    let values = Object.values(group.location.infoj)
        .filter(field => { if (field.group === group.label) return field.value });

    if (!values.length) return; // break when no data to show

    group.td = _xyz.utils.wire()
    `<td colSpan=2>`;

    group.row.appendChild(group.td);

    group.div = _xyz.utils.wire()
    `
  <div style="display: none;" class="drawer panel expandable">`;

    group.expanded && group.div.classList.add('expanded');

    group.td.appendChild(group.div);

    group.header = _xyz.utils.wire()
    `
  <div
    class="header primary-colour"
    style="text-align: left;"
    onclick=${ e => {
      _xyz.utils.toggleExpanderParent(e.target, true);
    }}><span>${group.label}`;

    group.div.appendChild(group.header);

    // Add table
    group.table = _xyz.utils.wire()
    `<table>`;

    group.div.appendChild(group.table);

};