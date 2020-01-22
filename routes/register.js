const env = require('../mod/env');

const fetch = require('node-fetch');

const bcrypt = require('bcrypt-nodejs');

const crypto = require('crypto');

const transformDate = require('../mod/date');

const mailer = require('../mod/mailer');

const template = require('backtick-template');

module.exports = fastify => {

  fastify.route({
    method: 'GET',
    url: '/register',
    handler: async (req, res) => {

      const tmpl = await fetch(`${req.headers.host.includes('localhost') && 'http' || 'https'}://${req.headers.host}${process.env.DIR || ''}/views/register.html`);

      const html = template(await tmpl.text(), {
        dir: process.env.DIR || '',
        captcha: process.env.GOOGLE_CAPTCHA && process.env.GOOGLE_CAPTCHA.split('|')[0] || '',
      });

      res.type('text/html').send(html);

    }
  });

  fastify.route({
    method: 'POST',
    url: '/register',
    handler: async (req, res) => {

      if (process.env.GOOGLE_CAPTCHA && process.env.GOOGLE_CAPTCHA.split('|')[1]) {

        const response = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.GOOGLE_CAPTCHA.split('|')[1]}&response=${req.body.captcha}`);

        const captcha_verification = await response.json();
        
        if (captcha_verification.score < 0.6) return res.redirect(process.env.DIR || '' + '/login?msg=fail');

      }

      const email = req.body.email;

      // Backend validation of email address.
      if (!/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {

        return res.redirect(process.env.DIR || '' + '/login?msg=validation');
      }

      var rows = await env.acl(`SELECT * FROM acl_schema.acl_table WHERE lower(email) = lower($1);`, [email]);

      if (rows instanceof Error) return res.redirect(process.env.DIR || '' + '/login?msg=badconfig');

      const user = rows[0];
      const password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8));
      const verificationtoken = crypto.randomBytes(20).toString('hex');

      const date = transformDate();

      // Set password for existing user and remove existing verification.
      if (user) {

        if (user.blocked) return res.redirect(process.env.DIR || '' + '/login?msg=fail');

        rows = await env.acl(`
        UPDATE acl_schema.acl_table SET
          password_reset = '${password}',
          verificationtoken = '${verificationtoken}',
          access_log = array_append(access_log, '${date}@${req.ips.pop() || req.ip}')
        WHERE lower(email) = lower($1);`,
          [email]);

        if (rows instanceof Error) return res.redirect(process.env.DIR || '' + '/login?msg=badconfig');

        mailer({
          to: user.email,
          subject: `Please verify your password reset for ${req.headers.host}${process.env.DIR || ''}`,
          text: 'A new password has been set for this account. \n \n'
            + `Please verify that you are the account holder: ${req.headers.host.includes('localhost') && 'http' || 'https'}://${req.headers.host}${process.env.DIR || ''}/user/verify/${verificationtoken} \n \n`
            + `The reset occured from this remote address ${req.headers['X-Forwarded-For'] || 'localhost'} \n \n`
            + 'This wasn\'t you? Please let your manager know. \n \n'
        });

        return res.redirect(process.env.DIR || '' + '/login?msg=validation');
      }

      // Create new user account
      rows = await env.acl(`
      INSERT INTO acl_schema.acl_table (email, password, verificationtoken, access_log)
      SELECT
        '${email}' AS email,
        '${password}' AS password,
        '${verificationtoken}' AS verificationtoken,
        array['${date}@${req.ips.pop() || req.ip}'] AS access_log;`);

      if (rows instanceof Error) return res.redirect(process.env.DIR || '' + '/login?msg=badconfig');

      mailer({
        to: email,
        subject: `Please verify your account on ${req.headers.host}${process.env.DIR || ''}`,
        text: `A new account for this email address has been registered with ${req.headers.host}${process.env.DIR || ''} \n \n`
          + `Please verify that you are the account holder: ${req.headers.host.includes('localhost') && 'http' || 'https'}://${req.headers.host}${process.env.DIR || ''}/user/verify/${verificationtoken} \n \n`
          + 'A site administrator must approve the account before you are able to login. \n \n'
          + 'You will be notified via email once an adimistrator has approved your account. \n \n'
          + `The account was registered from this remote address ${req.headers['X-Forwarded-For'] || 'localhost'} \n \n`
          + 'This wasn\'t you? Do NOT verify the account and let your manager know. \n \n'

      });

      return res.redirect(process.env.DIR || '' + '/login?msg=validation');

    }
  });

};