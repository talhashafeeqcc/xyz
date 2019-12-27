---
title: Deploy
tags: [deploy, root]
layout: root.html

---

## Getting started

The XYZ middleware can be run as a node process by initiating the server.js file from the XYZ root directory.

Start by cloning the XYZ repository from GEOLYTIX' public GitHub repository.

```
git clone https://github.com/GEOLYTIX/xyz
```

From the XYZ root, `npm install` the required node_modules as defined by the project's package manifest.

Use `npm run build` to bundle the XYZ library using webpack.

Initializing the server.js file with node will now create a node process that uses Fastify as local web server and router. Without additional environment settings Fastify will listen on port 3000 and serve a zero configuration workspace consisting of a single OpenStreetMap tile layer.

![](../getting_started.jpg)
