const gaz_locale = require('../mod/gazetteer/locale')

const gaz_google = require('../mod/gazetteer/google')

const gaz_mapbox = require('../mod/gazetteer/mapbox')

const gaz_opencage = require('../mod/gazetteer/opencage')

const getWorkspace = require('../mod/workspace/_workspace')

let _workspace = getWorkspace()

const auth = require('../mod/auth/handler')({
  public: true
})

module.exports = async (req, res) => {

  await auth(req, res)

  if (req.query.clear_cache) {
    _workspace = getWorkspace()
    return
  }

  const workspace = await _workspace

  const locale = workspace.locales[req.query.locale]

  // Return 406 is gazetteer is not found in locale.
  if (!locale.gazetteer) return res.status(400).send(new Error('Gazetteer not defined for locale.'));

  // Create an empty results object to be populated with the results from the different gazetteer methods.
  let results = [];

  if (req.query.source) {

    if (req.query.source === 'GOOGLE') {

      results = await gaz_google(req.query.q, locale.gazetteer);

      // Return error message _err if an error occured.
      if (results._err) return res.status(500).send(results._err);

      // Return results to client.
      return res.send(results);
    }

  }

  // Locale gazetteer which can query datasources in the same locale.
  if (locale.gazetteer.datasets) {
    results = await gaz_locale(req, locale);

    // Return error message _err if an error occured.
    if (results._err) return res.status(500).send(results._err);

    // Return and send results to client.
    if (results.length > 0) return res.send(results);
  }

  // Query Google Maps API
  if (locale.gazetteer.provider === 'GOOGLE') {
    results = await gaz_google(req.query.q, locale.gazetteer);

    // Return error message _err if an error occured.
    if (results._err) return res.status(500).send(results._err);
  }

  if (locale.gazetteer.provider === 'OPENCAGE') {
    results = await gaz_opencage(req.query.q, locale.gazetteer);
  }

  // Query Mapbox Geocoder API
  if (locale.gazetteer.provider === 'MAPBOX') {
    results = await gaz_mapbox(req.query.q, locale.gazetteer);

    // Return error message _err if an error occured.
    if (results._err) return res.status(500).send(results._err);
  }

  // Return results to client.
  res.send(results);

}