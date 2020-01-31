function _roles(req, res, next) {

  req.params.token.roles = req.params.token.roles || []

  if (req.params.layer.roles) {

    if (!Object.keys(req.params.layer.roles).some(
      role => req.params.token.roles.includes(role)
    )) {
      res.status(400)
      return next(new Error('Insufficient role priviliges.'))
    }

  }

  // Parse filter from query string.
  req.params.filter = req.query.filter && JSON.parse(req.query.filter) || {}

  // Apply role filter
  req.params.token.roles.filter(
    role => req.params.layer.roles && req.params.layer.roles[role]).forEach(
    role => {
      let key = Object.keys(req.params.layer.roles[role])[0]
      if (!req.params.filter[key]) {
        Object.assign(req.params.filter, req.params.layer.roles[role])

      } else {
        req.params.filter[key] = Array.prototype.concat(req.params.filter[key], req.params.layer.roles[role][key])

      }
    }
  )

  next()
}