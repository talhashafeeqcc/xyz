const _templates = require('../mod/workspace/templates')

module.exports = async (req, res) => {

  if (req.body) return register(req, res)

  const templates = await _templates

  const html = templates._register.render({
    dir: process.env.DIR || '',
    captcha: process.env.GOOGLE_CAPTCHA && process.env.GOOGLE_CAPTCHA.split('|')[0] || '',
  })

  res.send(html)
}

const bcrypt = require('bcryptjs')

const crypto = require('crypto')

const transformDate = require('../../mod/date')

const acl = require('../../mod/auth/acl')()

const mailer = require('../../mod/mailer')

async function register(req, res) {

  if (process.env.GOOGLE_CAPTCHA && process.env.GOOGLE_CAPTCHA.split('|')[1]) {

    const response = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.GOOGLE_CAPTCHA.split('|')[1]}&response=${req.body.captcha}`)

    const captcha_verification = await response.json()
    
    if (captcha_verification.score < 0.6) return res.status(500).send('Captcha failed.')

  }

  var rows = await acl(`SELECT * FROM acl_schema.acl_table WHERE lower(email) = lower($1);`, [req.body.email])

  if (rows instanceof Error) return res.status(500).send('Failed to query PostGIS table.')

  const user = rows[0]

  const password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8))

  const verificationtoken = crypto.randomBytes(20).toString('hex')

  const date = transformDate()

  if (user) {

    if (user.blocked) return res.status(500).send('User account is blocked.')

    // Reset password.
    rows = await acl(`
    UPDATE acl_schema.acl_table SET
      password_reset = '${password}',
      verificationtoken = '${verificationtoken}',
      access_log = array_append(access_log, '${date}@${req.headers['X-Forwarded-For'] || 'localhost'}')
    WHERE lower(email) = lower($1);`, [req.body.email])

    if (rows instanceof Error) return res.status(500).send('Failed to query PostGIS table.')

    await mailer({
      to: user.email,
      subject: `Please verify your password reset for ${req.headers.host}${process.env.DIR || ''}`,
      text: `A new password has been set for this account.
      Please verify that you are the account holder: ${req.headers.host.includes('localhost') && 'http' || 'https'}://${req.headers.host}${process.env.DIR || ''}/api/user/verify?verificationtoken=${verificationtoken}
      The reset occured from this remote address ${req.headers['X-Forwarded-For'] || 'localhost'}
      This wasn't you? Please let your manager know.`
    })

    return res.send('Password will be reset after email verification.')
  }

  // Create new user account
  var rows = await acl(`
  INSERT INTO acl_schema.acl_table (email, password, verificationtoken, access_log)
  SELECT
    '${req.body.email}' AS email,
    '${password}' AS password,
    '${verificationtoken}' AS verificationtoken,
    array['${date}@${req.ips.pop() || req.ip}'] AS access_log;`)

  if (rows instanceof Error) return res.status(500).send('Failed to query PostGIS table.')

  await mailer({
    to: req.body.email,
    subject: `Please verify your account on ${req.headers.host}${process.env.DIR || ''}`,
    text: `A new account for this email address has been registered with ${req.headers.host}${process.env.DIR || ''}
    Please verify that you are the account holder: ${req.headers.host.includes('localhost') && 'http' || 'https'}://${req.headers.host}${process.env.DIR || ''}/api/user/verify?verificationtoken=${verificationtoken}
    A site administrator must approve the account before you are able to login.
    You will be notified via email once an adimistrator has approved your account.
    The account was registered from this remote address ${req.headers['X-Forwarded-For'] || 'localhost'}\n
    This wasn't you? Do NOT verify the account and let your manager know.`
  })

  return res.send('A new account has been registered and is awaiting email verification.')

}