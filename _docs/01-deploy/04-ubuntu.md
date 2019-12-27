---
title: Linux / PM2
tags: [deploy]
layout: root.html

---

## Deploying on a Ubuntu server

For deployments on Ubuntu we use the [PM2](https://github.com/Unitech/pm2) process manager to run multiple instances of the framework on different ports on the same server. Environment settings for PM2 instances can be provided from a JSON document.

```
pm2 start environment.json
```