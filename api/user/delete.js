const requestBearer = require('../../mod/requestBearer');

const acl = require('../../mod/auth/acl')();

const mailer = require('../../mod/mailer');

module.exports = (req, res) => requestBearer(req, res, [ handler ], {
  admin_user: true
});

async function handler(req, res) {

  const email = req.query.email.replace(/\s+/g, '');

  // Delete user account in ACL.
  var rows = await acl(`
    DELETE FROM acl_schema.acl_table
    WHERE lower(email) = lower($1);`, [email]);

  if (rows instanceof Error) return res.status(500).send('Failed to query PostGIS table.');

  // Sent email to inform user that their account has been deleted.
  await mailer({
    to: email,
    subject: `This ${req.headers.host}${process.env.DIR || ''} account has been deleted.`,
    text: `You will no longer be able to log in to ${req.headers.host}${process.env.DIR || ''}`
  });

  res.send('User account deleted.');

};