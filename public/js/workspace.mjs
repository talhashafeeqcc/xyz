export default _xyz => {

  return {
    fetchWS: fetchWS,
    setWS: setWS,
  };

  async function fetchWS() {

    const promise = await fetch(
      _xyz.host +
      '/api/workspace/get?' +
      _xyz.utils.paramString({
        token: _xyz.token
      }));

    // Assign workspace.
    const workspace = await promise.json();

    _xyz.workspace.locales = workspace.locales;
  };

  function setWS(callback) {

    // XHR to retrieve workspace from host backend.
    const xhr = new XMLHttpRequest();

    xhr.open('GET', _xyz.host + '/api/workspace/get?' + _xyz.utils.paramString({
      token: _xyz.token
    }));
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.responseType = 'json';
    xhr.onload = e => {

      if (e.target.status !== 200) return console.error('Failed to retrieve workspace from XYZ host!');

      _xyz.workspace.locales = e.target.response.locales;

      loadLocale(callback);
    };

    xhr.send();
  };

  function loadLocale(callback) {

    _xyz.locale = _xyz.locale || (_xyz.hooks && _xyz.hooks.current.locale) || Object.keys(_xyz.workspace.locales)[0];

    // Assigne workspace locales from locales list and input params.
    _xyz.workspace.locale = Object.assign({ key: _xyz.locale }, _xyz.workspace.locales[_xyz.locale]);

    loadScripts(callback)
  };

  function loadScripts(callback) {

    if (!_xyz.workspace.locale.scripts) return loadLayers(callback);

    Promise.all(_xyz.workspace.locale.scripts.map(script => _xyz.utils.loadScript(script + '&token=' + _xyz.token)))
      .then(() => loadLayers(callback));
  }

  function loadLayers(callback){

    Object.keys(_xyz.workspace.locale.layers)
    .filter(key => key.indexOf('__') === -1)
    .forEach(key => {
      _xyz.layers.list[key] = _xyz.layers.decorate(_xyz.workspace.locale.layers[key]);
    });

    callback && callback(_xyz);
  }

};