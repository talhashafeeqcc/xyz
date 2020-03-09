const auth = require('../../mod/auth/handler')({
  admin_user: true,
  login: true
})

const acl = require('../../mod/auth/acl')()

const mailer = require('../../mod/mailer')

module.exports = async (req, res) => {

  await auth(req, res)

  if (res.finished) return

  var rows = await acl(`SELECT * FROM acl_schema.acl_table WHERE approvaltoken = $1;`, [req.query.approvaltoken])

  if (rows instanceof Error) return res.status(500).send('Failed to query PostGIS table.')

  const user = rows[0]

  if (!user) return res.send('Token not found. The token has probably been resolved already.')

  var rows = await acl(`
  UPDATE acl_schema.acl_table SET
    approved = true,
    approvaltoken = null,
    approved_by = '${req.params.token.email}'
  WHERE lower(email) = lower($1);`, [user.email])

  if (rows instanceof Error) return res.status(500).send('Failed to query PostGIS table.')

  await mailer({
    to: user.email,
    subject: `This account has been approved on ${req.headers.host}${process.env.DIR || ''}`,
    text: `You are now able to log on to ${req.headers.host.includes('localhost') && 'http' || 'https'}://${req.headers.host}${process.env.DIR || ''}`
  })

  res.send('The account has been approved by you. An email has been sent to the account holder.')

}