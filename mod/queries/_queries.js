const template = require('backtick-template')

const fetch = require('node-fetch')

const getWorkspace = require('../workspace/get')

const workspace = getWorkspace()

const mvt_cache = require('./mvt_cache')

const get_nnearest = require('./get_nnearest')

module.exports = async () => {

    Object.assign(workspace, await workspace)

    const queries = {
        get_nnearest: get_nnearest,
        mvt_cache: mvt_cache,
    }

    for (key of Object.keys(workspace.queries)) {

        const response = await fetch(
            workspace.queries[key].template,
            { headers: new fetch.Headers({ Authorization: `token ${process.env.KEY_GITHUB}` }) })

        const b64 = await response.json()
        const buff = await Buffer.from(b64.content, 'base64')
        const querytemplate = await buff.toString('utf8')

        queries[key] = {
            template: params => template(querytemplate, params),
            dbs: workspace.queries[key].dbs || null,
            roles: workspace.queries[key].roles || null,
            admin_workspace: workspace.queries[key].admin_workspace || null,
        }

    }

    return queries

}