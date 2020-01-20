const transformDate = require('../date');

const mailer = require('../mailer');

const fetch = require('node-fetch');

const bcrypt = require('bcrypt-nodejs');

const crypto = require('crypto');

const jwt = require('jsonwebtoken');

const acl = require('./acl')();

module.exports = async (req) => {

  if (process.env.GOOGLE_CAPTCHA) {

    const response = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.GOOGLE_CAPTCHA.split('|')[1]}&response=${req.body.captcha}`);

    const captcha_verification = await response.json();

    if (captcha_verification.score < 0.6) return new Error('Captcha Fail');

  }

  if (!req.body.email) return new Error('Missing email');

  if (!req.body.password) return new Error('Missing password');

  const date = transformDate();

  var rows = await acl(`
    UPDATE acl_schema.acl_table
    SET access_log = array_append(access_log, '${date}@${'foo' || req.req.ips.pop() || req.req.ip}')
    WHERE lower(email) = lower($1)
    RETURNING *;`, [req.body.email]);

  if (rows instanceof Error) return new Error('Bad Config');

  // Get user record from first row.
  const user = rows[0];

  if (user && user.blocked) return new Error('User blocked');

  // Redirect back to login (get) with error msg if user is not found.
  if (!user) return new Error('No user');

  // Redirect back to login (get) with error msg if user is not valid.
  if (!user.verified || !user.approved) {

    // Sent fail mail when to account email if login failed.
    mailer({
      to: user.email,
      subject: `A failed login attempt was made on ${env.alias || req.headers.host}${env.path}`,
      text: `${user.verified ? 'The account has been verified. \n \n' : 'The account has NOT been verified. \n \n'}`
        + `${user.approved ? 'The account has been approved. \n \n' : 'Please wait for account approval confirmation email. \n \n'}`
        + `The failed attempt occured from this remote address ${req.req.connection.remoteAddress} \n \n`
        + 'This wasn\'t you? Please let your manager know. \n \n'
    });

    return new Error('User not verified or approved');
  }

  // Check password from post body against encrypted password from ACL.
  if (bcrypt.compareSync(req.body.password, user.password)) {

    // Create token with 8 hour expiry.
    const token = {
      email: user.email,
      admin_user: user.admin_user,
      admin_workspace: user.admin_workspace,
      roles: user.roles
    };

    token.signed = jwt.sign(
      token,
      process.env.SECRET,
      {
        expiresIn: '8h'
      });

    return token;

  // Password from login form does NOT match encrypted password in ACL!
  } else {

    // Increase failed login attempts counter by 1 for user in ACL.
    var rows = await env.acl(`
      UPDATE acl_schema.acl_table
      SET failedattempts = failedattempts + 1
      WHERE lower(email) = lower($1)
      RETURNING failedattempts;`, [req.body.email]);

    if (rows instanceof Error) return new Error('Bad Config');

    // Check whether failed login attempts exceeds limit.
    if (rows[0].failedattempts >= parseInt(process.env.FAILED_ATTEMPTS) || 3) {

      // Create a new verification token and remove verified status in ACL.
      const verificationtoken = crypto.randomBytes(20).toString('hex');

      // Store new verification token in ACL.
      var rows = await env.acl(`
        UPDATE acl_schema.acl_table
        SET
          verified = false,
          verificationtoken = '${verificationtoken}'
        WHERE lower(email) = lower($1);`, [req.body.email]);

      if (rows instanceof Error) return res.redirect(env.path + '/login?msg=badconfig');

      // Sent email with verification link to user.
      mailer({
        to: user.email,
        subject: `Too many failed login attempts occured on ${env.alias || req.headers.host}${env.path}`,
        text: `${parseInt(process.env.FAILED_ATTEMPTS) || 3} failed login attempts have been recorded on this account. \n \n`
          + 'This account has now been locked until verified. \n \n'
          + `Please verify that you are the account holder: ${req.headers.host.includes('localhost') && 'http' || 'https'}://${env.alias || req.headers.host}${env.path}/user/verify/${verificationtoken} \n \n`
          + 'Verifying the account will reset the failed login attempts. \n \n'
          + `The failed attempt occured from this remote address ${req.req.connection.remoteAddress} \n \n`
          + 'This wasn\'t you? Please let your manager know. \n \n'
      });

      // Failed login attempts have not yet exceeded limit.
    } else {

      // Sent fail mail.
      mailer({
        to: user.email,
        subject: `A failed login attempt was made on ${env.alias || req.headers.host}${env.path}`,
        text: 'An incorrect password was entered! \n \n'
          + `The failed attempt occured from this remote address ${req.req.connection.remoteAddress} \n \n`
          + 'This wasn\'t you? Please let your manager know. \n \n'
      });
    }

    return new Error('Failed to create token');
  }

}