module.exports = {
access: 'admin_workspace',
render: _ => `
<!DOCTYPE html>
<html lang="en">

<head data-dir="${_.dir}">
    <title>XYZ Workspace Administration</title>
    <link rel="icon" type="image/x-icon" href="${_.dir}/icons/favicon.ico" />
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <link rel="stylesheet" href="${_.dir}/codemirror/codemirror.css">
    
    <script src="${_.dir}/codemirror/codemirror.js" defer></script>
    <script src="${_.dir}/codemirror/javascript.js" defer></script>
    <script src="${_.dir}/codemirror/jsonlint.js" defer></script>
    <script src="${_.dir}/codemirror/lint.js" defer></script>
    <script src="${_.dir}/codemirror/lintjson.js" defer></script>

    <script src="${_.dir}/views/_admin_workspace.js" defer></script>

    <style>
        body {
            margin: 0;
        }
    
        button, a {
            margin-top: 10px;
            height: 50px;
            width: 50px;
            background-color: #fff;
            border: none;
        }
    
        .xyz-icon {
            width: 100%;
            height: 100%;
            pointer-events: none;
            background-repeat: no-repeat;
            background-size: contain;
            -webkit-background-size: contain;
            filter: invert(45%) sepia(55%) saturate(608%) hue-rotate(90deg) brightness(93%) contrast(90%);
            -webkit-filter: invert(45%) sepia(55%) saturate(608%) hue-rotate(90deg) brightness(93%) contrast(90%);
        }

        .icon-backup {
            background-image: url("${_.dir}/icons/icon-backup.svg");
        }

        .icon-description {
            background-image: url("${_.dir}/icons/icon-description.svg");
        }        
    </style>
</head>

<body data-token=${_.token} style="display: grid; grid-template-columns: 50px 1fr;">

    <div style="grid-column: 1;">

        <button id="btnUploadWS" class="enabled">
            <div class="xyz-icon icon-backup"></div>
        </button>

        <button id="btnFileWS" class="enabled">
            <div class="xyz-icon icon-description"></div>
            <input id="fileInputWS" type="file" accept=".json" style="display: none;">
        </button>

    </div>

    <div id="codemirror" style="grid-column: 2; border-left: 1px solid #eee;"></div>

</body>

</html>
`}