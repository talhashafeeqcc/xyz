const fs = require('fs');

const fetch = require('node-fetch');

const { join } = require('path');

module.exports = async () => {

    // const response = await fetch(
    //     `https:${env.workspace_connection.split(':')[1]}`,
    //     { headers: new fetch.Headers({ Authorization: `Basic ${Buffer.from(env.keys.GITHUB).toString('base64')}` }) });

    //   const b64 = await response.json();
    //   const buff = await Buffer.from(b64.content, 'base64');
    //   const utf8 = await buff.toString('utf8');

      //workspace = JSON.parse(utf8);

    if (process.env.WORKSPACE.split(':')[0] === 'https' || process.env.WORKSPACE.split(':')[0] === 'http') {

        const ws = await fetch(process.env.WORKSPACE);
           
        return await ws.json();

    }

}