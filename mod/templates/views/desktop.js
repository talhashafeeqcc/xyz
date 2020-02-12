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
    <link rel="stylesheet" href="${_.dir}/views/desktop.css" />

    <script src="${_.dir}/js/build/xyz_openlayers.js" defer></script>
    <script src="${_.dir}/views/desktop.js" defer></script>
</head>

<body
data-log=${_.log}
data-token=${_.token}
data-login=${_.login}>

    <div id="listviews">

        <div class="scrolly">
                
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

    <div class="mapview">

        <div class="btn-column lv1"></div>

        <div id="Map" class="map" ></div>

    </div>

    <div id="dataview" class="dataview">

        <div id="hozDivider"></div>

        <div class="resize_bar"></div>

        <nav class="nav_bar">
            <ul class="nav_bar-nav"></ul>
            <div class="tab-dropdown-container">
                <button class="tab-dropdown primary-colour">»</button>
                <div class="tab-dropdown-content">
                    <ul></ul>
                </div>
            </div>
        </nav>

        <div class="tab-content"></div>

        <div class="btn-column lv0">
        
            <button style="margin-top: -10px; background: none;" id="toggleDataview" class="enabled">
                <div class="xyz-icon icon-vertical-align-top"></div>
            </button>

            <button id="btnDataViewport" style="display: none;" class="enabled">
                <div class="xyz-icon icon-fullscreen"></div>            
            </button>
                    
        </div>

    </div>

</body>

</html>
`}