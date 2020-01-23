const auth = require('../../mod/auth/handler');

const acl = require('../../mod/auth/acl')();

module.exports = (req, res) => auth(req, res, handler, {
  admin_user: true
});

async function handler(req, res) {

  // Get user list from ACL.
  var rows = await acl(`
  SELECT
    email,
    verified,
    approved,
    admin_user,
    admin_workspace,
    roles,
    access_log[array_upper(access_log, 1)],
    failedattempts,
    approved_by,
    blocked
  FROM acl_schema.acl_table;`);

  if (rows instanceof Error) return res.status(500).send('Failed to query PostGIS table.');
  
  res.send(rows);

};