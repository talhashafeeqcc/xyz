const env = require('../../mod/env');

const mailer = require('../../mod/mailer');

module.exports = fastify => {
    
  fastify.route({
    method: 'GET',
    url: '/user/delete',
    preValidation: fastify.auth([
      (req, res, next) => fastify.authToken(req, res, next, {
        admin_user: true
      })
    ]),
    handler: async (req, res) => {

      const email = req.query.email.replace(/\s+/g,'');

      // Delete user account in ACL.
      var rows = await env.acl(`
      DELETE FROM acl_schema.acl_table
      WHERE lower(email) = lower($1);`,
      [email]);

      if (rows instanceof Error) return res.redirect(process.env.DIR || '' + '/login?msg=badconfig');

      // Sent email to inform user that their account has been deleted.
      await mailer({
        to: email,
        subject: `This ${process.env.ALIAS || req.headers.host}${process.env.DIR || ''} account has been deleted.`,
        text: `You will no longer be able to log in to ${req.headers.host.includes('localhost') && 'http' || 'https'}://${process.env.ALIAS || req.headers.host}${process.env.DIR || ''}`
      });

      res.code(200).send('User account deleted.');

    }
  });

};