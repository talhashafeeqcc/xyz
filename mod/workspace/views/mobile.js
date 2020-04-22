module.exports = {
render: _ => `
<!DOCTYPE html>
<html lang="en">

<head data-dir="${_.dir}">
    <title>${_.title}</title>
    <link rel="icon" type="image/x-icon" href="${_.dir}/icons/favicon.ico" />
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <link rel="stylesheet" href="${_.dir}/css/openlayers.css" />
    <link rel="stylesheet" href="${_.dir}/css/control.css" />
    <link rel="stylesheet" href="${_.dir}/views/_mobile.css" />

    <script src="${_.dir}/js/build/xyz_openlayers.js" defer></script>
    <script src="${_.dir}/views/_mobile.js" defer></script>
</head>

<body
    data-log=${_.log}
    data-token=${_.token}
    data-login=${_.login}>

    <div id="Map" class="mapview map" style="margin-top: 0;"></div>

    <div class="btn-column"></div>

    <div id="spacer"></div>

    <div id="ctrls">

        <div class="tab active">
            <div class="xyz-icon icon-layers"></div>
            <div class="listview">
                <div class="listview-title secondary-colour-bg">Layers</div>
                <div id="layers"></div>
            </div>
        </div>

        <div class="tab">
            <div class="xyz-icon icon-location"></div>
            <div class="listview">
                <div class="listview-title secondary-colour-bg">Locations</div>
                <button id="clear_locations" class="bold primary-colour">Clear all locations.</button>
                <div id="locations"></div>
            </div>
        </div>

    </div>

</body>

</html>
`}