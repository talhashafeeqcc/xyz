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
    <link rel="stylesheet" href="${_.dir}/views/_desktop.css" />
    <!--link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/GEOLYTIX/xyz@master/public/views/desktop.css"-->
    <!--link rel="stylesheet" href="${_.dir}/api/provider/github?url=api.github.com/repos/GEOLYTIX/xyz/contents/public/views/desktop.css&content_type=text/css"-->

    <script src="${_.dir}/js/build/xyz_openlayers.js" defer></script>
    <script src="${_.dir}/views/_desktop.js" defer></script>
    <!--script src="https://cdn.jsdelivr.net/gh/GEOLYTIX/xyz@master/public/views/desktop.js" defer></script-->
    <!--script src="${_.dir}/api/provider/github?url=api.github.com/repos/GEOLYTIX/xyz/contents/public/views/desktop.js" defer></script>-->
</head>

<body
data-log=${_.log}
data-token=${_.token}
data-login=${_.login}>

  <div id="listviews">

    <div>

      <div>

        <div class="listview-title secondary-colour-bg">Layers</div>

        <div id="layers"></div>

      </div>

      <div>

        <div class="listview-title secondary-colour-bg">Locations</div>

        <button id="clear_locations" class="bold primary-colour">Clear all locations.</button>

        <div id="locations"></div>

      </div>

    </div>

  </div>

  <div id="vertDivider"></div>

  <div id="Map" class="mapview map">

    <div class="btn-column"></div>

    <div id="tabview" style="display: none; max-height: 65px;">

      <div id="hozDivider"></div>

    </div>

  </div>

</body>

</html>
`}