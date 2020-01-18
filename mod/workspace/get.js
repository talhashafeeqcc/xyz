const fetch = require('node-fetch');

const fs = require('fs');

module.exports = async () => {

  switch (process.env.WORKSPACE.split(':')[0]) {
    case 'github': return github(process.env.WORKSPACE.split(':')[1])
    case 'http': return http(process.env.WORKSPACE)
    case 'https': return http(process.env.WORKSPACE)
    case 'file': return file(process.env.WORKSPACE.split(':')[1])
    default: console.log('No Workspace')
  }

}

async function http(ref){

  const ws = await fetch(ref);

  return await ws.json();
}

async function github(ref){

  const response = await fetch(
    `https:${ref}`,
    { headers: new fetch.Headers({ Authorization: `Basic ${Buffer.from(process.env.KEY_GITHUB).toString('base64')}` }) });

  const b64 = await response.json();
  const buff = await Buffer.from(b64.content, 'base64');
  const utf8 = await buff.toString('utf8');

  return JSON.parse(utf8);
}

async function file(ref){

    return await JSON.parse(fs.readFileSync(`./workspaces/${ref}`), 'utf8');
}