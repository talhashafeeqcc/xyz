export default _xyz => group => {

    if (!group.label) return;

    // check if group has any data
    let values = Object.values(group.location.infoj)
        .filter(field => { if (field.group === group.label) return field.value });

    if (!values.length) return; // break when no data to show

    group.div = _xyz.utils.wire()
    `
  <div style="display: none; grid-column: 1 / span 2" class="drawer panel expandable ${group.class || ''}">`;

    group.expanded && group.div.classList.add('expanded');

    group.header = _xyz.utils.wire()
    `
  <div
    class="header primary-colour"
    style="text-align: left; grid-column: 1 / span 2;"
    onclick=${ e => {
        _xyz.utils.toggleExpanderParent(e.target, true);
    }}><span>${group.label}`;

    group.div.appendChild(group.header);

};