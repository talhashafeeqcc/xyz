const auth = require('../../mod/auth/handler')({
  admin_workspace: true
})

const { Pool } = require('pg')

module.exports = async (req, res) => {

  await auth(req, res)

  if (res.finished) return

  try {
    const pool = new Pool({
      connectionString: process.env.WORKSPACE.split('|')[0],
      statement_timeout: 10000
    })

    await pool.query(`
        INSERT INTO ${process.env.WORKSPACE.split('|')[1]} (settings)
        SELECT $1 AS settings;`, [req.body]);

    return res.send('PostgreSQL Workspace updated.')

  } catch (err) {
    console.error(err)
    return res.status(500).send('FAILED to update PostgreSQL Workspace table.')
  }

}