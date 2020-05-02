**v2.3.0**

# xyz

**Open source presentation, controller, domain and service layers for spatial data and application interfaces.**

The XYZ stack consists of several application layers.

The Node **domain and service layers** take the pattern of a RESTful API which provides secure gateways for spatial data sources and 3rd party service providers. These application layers may be deployed as serverless functions to the cloud.

Spatial data must be stored in a cloud accessible PostGIS (v2.4+) database, allowing XYZ' service layer to pass transaction script to the **data source layer**.

**Application control and presentation layers** are provided as a javscript library which may be loaded in any browser which supports ES6. XYZ' client library utilizes the Openlayers mapping engine and other visualisation libraries such as Tabulator and Chart.js to power engaging application views.

Please visit the XYZ project page at [geolytix.github.io/xyz](https://geolytix.github.io/xyz/) for in depth articles, code samples, documentation and developer notes.

### Application Views

Application views use the XYZ client and a combination of markup, stylesheets, and scripts to wire interface elements to data interfaces in the XYZ middleware.

Views are dashboards which may integrate a range of control elements such as maps, info panels, lists, graphs and tables.

Custom views can be integrated either with the middleware itself or hosted with other ressources in a seperate CDN. We recommend [jsdelivr](https://www.jsdelivr.com/) for access to ressources in Github repositories.

### Templating

XYZ' templating is a process of assigning configuration objects and parameter substitution.

### Environment Settings & Workspaces

Environment settings contain sensitive information such as connection strings for data sources, security information and API keys.

Workspaces define the layers and locations to be loaded by the API and application views.

## Features

### Deployment

The XYZ API may be deployed as a Node Express server which we use locally for debugging. It is however recommended to deploy XYZ endpoints as serverless functions to Vercell's (former Zeit) Now platform. XYZ has been designed to fall within the handler and memory limit that qualify for the free Hobby plan.

### Github API

Configurations and ressources may either be deployed with the application code from a local repository or stored in Github repositories. Private repositories are now freely available to everyone. XYZ workspaces must not contain sensitive information and may also be stored in a public repository. Supplying a Github access token with the environment settings allows the domain layer access to private Github repositories.

### Security

Access to the API can be secured with JWT keys. Token may be provided as URL parameter or stored safely within in a cookie. User accounts can be stored in a PostgreSQL Access Control List (ACL). Administrative and functional roles can be assigned to registered user accounts. Roles define the level of access to the data source layer. The security strategy also supports the issue of API keys which may be revoked and do not provide access to any sensitive administrative tasks.

### Editing

User may edit geometries, attributes, and model data in connected PostGIS data sources.

### Data aggregation layer

SQL statements composed in the middleware allow the presentation of aggregated data views from large tables on the client side.

### Dynamic MVT

The XYZ middleware is capable to generate and cache vector tiles in connected PostGIS datasources.

### Proxy for 3rd party services

The XYZ middle may consume 3rd party services from Google Maps, Mapbox, MapTiler, Bing or Here.


## Dependencies

[Openlayers](https://github.com/openlayers/openlayers) - High-performance web mapping engine.

[jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) - A Node implementation of JSON Web Token.

[bcryptjs](https://www.npmjs.com/package/bcryptjs) - Optimized bcrypt in JavaScript with zero dependencies.

[Node-Postgres](https://github.com/brianc/node-postgres) - PostgreSQL client for Node.

[Express](https://www.npmjs.com/package/express) - Fast, unopinionated, minimalist web framework for Node.

[express-http-proxy](https://www.npmjs.com/package/express-http-proxy) - Express middleware to proxy request to another host and pass response back to original caller.

[hyperHTML](https://github.com/WebReflection/hyperHTML) - A Fast & Light Virtual DOM Alternative.

[chart.js](https://github.com/chartjs/Chart.js) - For the creation of HTML canvas charts in info panels and report views.

[tabulator](https://github.com/olifolkerd/tabulator) - Javascript library for interactive tables and data grids.

[flatpickr](https://www.npmjs.com/package/flatpickr) - A customisable JavaScript datetime picker.

[chroma.js](https://github.com/gka/chroma.js) - A JavaScript library for all kinds of color manipulations.

[TurfJS](https://github.com/Turfjs/turf) - A modular geospatial engine for geometry aggregation and transformations in the middleware and on the client side.

[lodash](https://github.com/lodash/lodash) - A modern JavaScript utility library delivering modularity, performance, & extras.

[nodemailer](https://github.com/nodemailer/nodemailer) - Send e-mails with Node – easy as cake!

[node-fetch](https://github.com/bitinn/node-fetch) - A light-weight module that brings window.fetch to Node.

[mobile-detect.js](https://github.com/hgoebl/mobile-detect.js) - Node device detection from request header.


## License

Free use of the code in this repository is allowed through a [MIT license](https://github.com/GEOLYTIX/xyz/blob/master/LICENSE).


## BrowserStack

BrowserStack supports this OpenSource project, providing us with valuable tools to test the XYZ client on different platforms.