module.exports = {
access: 'admin_user',
render: _ => `
<!DOCTYPE html>
<html>

<head data-dir="${_.dir}">
    <title>XYZ | User Administration</title>
    <link rel="icon" type="image/x-icon" href="${_.dir}/icons/favicon.ico" />
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <link rel="stylesheet" href="${_.dir}/tabulator/tabulator.css">

    <script src="${_.dir}/tabulator/tabulator.js" defer></script>

    <script src="${_.dir}/views/_admin_user.js" defer></script>

    <style>

        body {
            margin: 40px;
            padding: 0;
            font: 14px "Open Sans", sans-serif;
        }

        .tabulator-row .tabulator-cell {
            margin: 2px;
        }

        .tabulator .tabulator-header .tabulator-col {
            margin: 2px;
            padding-bottom:10px;
        }

        .icon-face {
            background-image: url("${_.dir}/icons/icon-face.svg");
        }

        .icon-logout {
            background-image: url("${_.dir}/icons/icon-logout.svg");
        }

        .icon-tick-done {
            background-image: url("${_.dir}/icons/icon-tick-done.svg");
        }

        .icon-tick-done-all {
            background-image: url("${_.dir}/icons/icon-tick-done-all.svg");
        }

        .icon-warning {
            background-image: url("${_.dir}/icons/icon-warning.svg");
        }

        .icon-supervisor-account {
            background-image: url("${_.dir}/icons/icon-supervisor-account.svg");
        }

        .icon-settings {
            background-image: url("${_.dir}/icons/icon-settings.svg");
        }

        .icon-key {
            background-image: url("${_.dir}/icons/icon-key.svg");
        }

        .icon-lock-closed {
            background-image: url("${_.dir}/icons/icon-lock-closed.svg");
            height:40px;
            width:30px;
        }

        .xyz-icon {
            background-repeat: no-repeat;
            background-position: center;
            height: 36px;
            width:36px;
        }
    </style>
    
</head>

<body>

    <h1>Account admin</h1>

    <div id="userTable"></div>

</body>

</html>
`}