const auth = require('./auth/handler')

module.exports = async (req, res, fns, _auth) => {

  _auth && fns.unshift(auth(_auth))

  for (const fn of fns) {

    try {

        if (await fn(req, res) instanceof Error) {
          console.error(err)
          res.status(500).send({"msg": "Content not found.", "err": err})
        }

        if (res.finished) return

    } catch (err) {

      console.error(err)
      res.status(500).send({"msg": "Content not found.", "err": err})
    }

  }

}