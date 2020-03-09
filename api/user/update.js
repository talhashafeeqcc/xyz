const auth = require('../../mod/auth/handler')({
  admin_user: true
})

const acl = require('../../mod/auth/acl')()

const mailer = require('../../mod/mailer')

module.exports = async (req, res) => {

  await auth(req, res)

  if (res.finished) return

  // Remove spaces from email.
  const email = req.query.email.replace(/\s+/g, '')

  if (req.query.field === 'roles') {
    req.query.value = `'{"${req.query.value.replace(/\s+/g, '').split(',').join('","')}"}'`
  }

  // Get user to update from ACL.
  var rows = await acl(`
  UPDATE acl_schema.acl_table
  SET
    ${req.query.field} = ${req.query.value === 'false' && 'NULL' || req.query.value},
    approved_by = '${req.params.token.email}'
  WHERE lower(email) = lower($1);`, [email])

  if (rows instanceof Error) return res.status(500).send('Failed to query PostGIS table.')

  // Send email to the user account if an account has been approved.
  if (req.query.field === 'approved' && req.query.value === 'true') {
    await mailer({
      to: email,
      subject: `This account has been approved for ${req.headers.host}${process.env.DIR || ''}`,
      text: `You are now able to log on to ${req.headers.host}${process.env.DIR || ''}`
    })

  }

  return res.send('Update successful')
}