const template = require('backtick-template')

const fetch = require('node-fetch')

const desktop = require('./desktop')

const mobile = require('./mobile')

module.exports = async (workspace) => {

    Object.assign(workspace, await workspace)

    const views = {
        desktop: desktop,
        mobile: mobile,
    }

    for (key of Object.keys(workspace.views || {})) {

        const response = await fetch(
            workspace.views[key].template,
            { headers: new fetch.Headers({ Authorization: `token ${process.env.KEY_GITHUB}` }) })

        const b64 = await response.json()
        const buff = await Buffer.from(b64.content, 'base64')
        const querytemplate = await buff.toString('utf8')

        views[key] = {
            template: params => template(querytemplate, params),
            dbs: workspace.views[key].dbs || null,
            roles: workspace.views[key].roles || null,
            admin_workspace: workspace.views[key].admin_workspace || null,
        }

    }

    return views

}