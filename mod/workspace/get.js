const fetch = require('node-fetch')

const fs = require('fs')

const { Pool } = require('pg');

const assignDefaults = require('./assignDefaults')

module.exports = async () => await assignDefaults(await get(process.env.WORKSPACE))

async function get(ref) {

  switch (ref && ref.split(':')[0]) {
    case 'http': return http(ref)
    case 'https': return http(ref)
    case 'file': return file(ref.split(':')[1])
    case 'github': return github(ref.split(':')[1])
    case 'postgres': return postgres(ref)
    default: {}
  }
}

async function http(ref){
  const ws = await fetch(ref)
  return await ws.json()
}

async function file(ref) {
  return await JSON.parse(fs.readFileSync(`./workspaces/${ref}`), 'utf8')
}

async function github(ref){

  const response = await fetch(
    `https:${ref}`,
    { headers: new fetch.Headers({Authorization: `token ${process.env.KEY_GITHUB}`}) })   

  const b64 = await response.json()
  const buff = await Buffer.from(b64.content, 'base64')
  const utf8 = await buff.toString('utf8')

  return JSON.parse(utf8)
}

async function postgres(ref) {

  const pool = new Pool({
    connectionString: ref.split('|')[0],
    statement_timeout: 10000
  })

  try {
    const { rows } = await pool.query(`SELECT * FROM ${ref.split('|')[1]} ORDER BY _id DESC LIMIT 1`)
    return rows[0].settings

  } catch(err) {
    console.error(err)
    return {}
  }
}