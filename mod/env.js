const _dbs = require('./pg/dbs')();

const _workspace = require('./workspace/get')();

module.exports = {

  port: process.env.PORT || 3000,

  acl_connection: (process.env.PRIVATE || process.env.PUBLIC) ? process.env.PRIVATE || process.env.PUBLIC : null,

  // Global dir expands the domain to create the root path for the application.
  path: process.env.DIR || '',

  // If set the alias will override the host header in notifications.
  alias: process.env.ALIAS ? process.env.ALIAS : null,

  desktop: process.env.DESKTOP_TEMPLATE ? process.env.DESKTOP_TEMPLATE : null,

  mobile: process.env.MOBILE_TEMPLATE ? process.env.MOBILE_TEMPLATE : null,

  // Assign Google Captcha site_key[0] and secret_key[1].
  captcha: process.env.GOOGLE_CAPTCHA && process.env.GOOGLE_CAPTCHA.split('|'),

  // Application access. Default is public.
  public: !process.env.PRIVATE,

  // Additional logs will be written to console if env.logs is true.
  logs: process.env.LOG_LEVEL,

  keys: Object.assign({}, ...Object.keys(process.env)
    .filter(key => key.split('_')[0] === 'KEY')
    .map(key => ({ [key.split('_')[1]]: process.env[key] }))),

  dbs: _dbs,

  workspace: _workspace,

  // cloudinary: process.env.CLOUDINARY && process.env.CLOUDINARY.split(' '),

};