const fetch = require('node-fetch')

//queries

const mvt_cache = require('./queries/mvt_cache')

const get_nnearest = require('./queries/get_nnearest')

const get_intersect = require('./queries/get_intersects')

const get_contains = require('./queries/get_contains')

const field_stats = require('./queries/field_stats')

const infotip = require('./queries/infotip')

const count_locations = require('./queries/count_locations')

const labels = require('./queries/labels')

const layer_extent = require('./queries/layer_extent')

//views

const mobile = require('./views/mobile')

const desktop = require('./views/desktop')

module.exports = async _workspace => {

    const workspace = await _workspace

    const templates = {

        //views
        _desktop: desktop,
        _mobile: mobile,

        //queries
        mvt_cache: mvt_cache,
        get_nnearest: get_nnearest,
        get_intersect: get_intersect,
        get_contains: get_contains,
        field_stats: field_stats,
        infotip: infotip,
        count_locations: count_locations,
        labels: labels,
        layer_extent: layer_extent,
    }

    for (key of Object.keys(workspace.templates || {})) {

        if (workspace.templates[key].template.toLowerCase().includes('api.github')) {
            const response = await fetch(
                workspace.templates[key].template,
                { headers: new fetch.Headers({ Authorization: `token ${process.env.KEY_GITHUB}` }) })
    
            const b64 = await response.json()
            const buff = await Buffer.from(b64.content, 'base64')
            var template = await buff.toString('utf8')
        } else {
            var template = workspace.templates[key].template
        }


        templates[key] = {
            render: params => template.replace(/\$\{(.*?)\}/g, matched=>params[matched.replace(/\$|\{|\}/g,'')] || ''),
            dbs: workspace.templates[key].dbs || null,
            roles: workspace.templates[key].roles || null,
            admin_workspace: workspace.templates[key].admin_workspace || null,
        }

    }

    return templates

}