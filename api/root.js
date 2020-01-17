const env = require('../mod/env');

const template = require('backtick-template');

const nanoid = require('nanoid');

const fetch = require('node-fetch');

module.exports = async (req, res, token = { access: 'public' }) => {

    env.workspace = await env.workspace;

    // const md = new Md(req.headers['user-agent']);

    // const platform = (md.mobile() === null || md.tablet() !== null) ? 'desktop' : 'mobile';

    const tmpl = await fetch(`${req.headers.host.includes('localhost') && 'http' || 'https'}://${req.headers.host}/views/desktop.html`) 

    const html = template(await tmpl.text(), {
        dir: env.path,
        title: env.workspace.title || 'GEOLYTIX | XYZ',
        nanoid: nanoid(6),
        token: req.query.token || token.signed || '""',
        log: env.logs || '""',
        login: (env.acl_connection) && 'true' || '""',
        pgworkspace: (env.pg.workspace) && 'true' || '""',
      });
    
    //Build the template with jsrender and send to client.
    res.send(html);

}