const auth = require('../../mod/auth/handler');

const acl = require('../../mod/auth/acl')();

module.exports = (req, res) => auth(req, res, handler, {
  admin_user: true
});

async function handler(req, res) {

  const email = req.query.email.replace(/\s+/g, '');

  // Get user to update from ACL.
  var rows = await acl(`
    SELECT access_log
    FROM acl_schema.acl_table
    WHERE lower(email) = lower($1);`, [email]);

  if (rows instanceof Error) return res.status(500).send('Failed to query PostGIS table.');

  return res.send(rows[0].access_log);

};