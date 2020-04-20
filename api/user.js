
const auth = require('../mod/auth/_handler')

const _method = {
  delete: {
    handler: require('../mod/user/delete'),
    access: {
      admin_user: true
    }
  },
  update: {
    handler: require('../mod/user/update'),
    access: {
      admin_user: true
    }
  },
  register: {
    handler: require('../mod/user/register')
  },
  verify: {
    handler: require('../mod/user/verify')
  },
  approve: {
    handler: require('../mod/user/approve'),
    access: {
      admin_user: true,
      login: true
    }
  },
  key: {
    handler: require('../mod/user/key'),
    access: {
      key: true,
      login: true
    }
  },
  token: {
    handler: (req, res) => res.send(req.params.token.signed),
    access: {
      login: true
    }
  }
}

module.exports = async (req, res) => {

  const method = _method[req.params.method || req.query.method]

  if (!method) return res.send('Help text.')

  method.access && await auth(req, res, method.access)

  if (res.finished) return
  
  return method.handler(req, res)
}
