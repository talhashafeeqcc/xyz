const auth = require('../../mod/auth/handler')

const { Pool } = require('pg')

module.exports = (req, res) => auth(req, res, handler, {
  admin_workspace: true,
  login: true
})

async function handler(req, res){

  try {
    const pool = new Pool({
      connectionString: process.env.WORKSPACE.split('|')[0],
      statement_timeout: 10000
    })

    await pool.query(`
    CREATE TABLE ${process.env.WORKSPACE.split('|')[1]} (
      "_id" serial not null,
      settings json not null);`)

    return res.send('PostgreSQL Workspace table created.')

  } catch(err) {
    console.error(err)
    return res.send('FAILED to create PostgreSQL Workspace table.')
  }

}