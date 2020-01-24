const _token = require('./token');

const login = require('./login');

const jwt = require('jsonwebtoken');

const acl = require('./acl')();

module.exports = async (req, res, next, access = {}) => {

  if (!req.body && typeof req.query.login !== 'undefined') return login(req, res);

  if (req.body && access.login) {

    const token = await _token(req);

    if (token instanceof Error) return login(req, res, token.message);

    if (access.admin_user && !token.admin_user) return login(req, res, 'Not an admin');

    if (access.admin_workspace && !token.admin_workspace) return login(req, res, 'Not an admin');

    return next(req, res, token);
  }

  // if (req.query.token === 'null') {
  //   delete req.query.token;
  // }

  // Public access without token.
  if (!req.query.token && access.public && !process.env.PRIVATE) {
    return next(req, res);
  }

  // Redirect to login
  if (!req.query.token && access.login) {
    return login(req, res);
  }

  // Private access without token.
  if (!req.query.token) {
    return res.status(401).send('Missing token.');
  }

  // Verify token (checks token expiry)
  jwt.verify(req.query.token, process.env.SECRET, async (err, token) => {

    if (err) return res.status(401).send('Invalid token.');

    // Token must have an email
    if (!token.email) return res.status(401).send('Invalid token.');

    if (token.api) {

      // Get user from ACL.
      var rows = await acl(`
        SELECT * FROM acl_schema.acl_table
        WHERE lower(email) = lower($1);`, [token.email]);

      if (rows instanceof Error) return res.status(500).send('Bad Config.');

      const user = rows[0];

      if (!user || !user.api || (user.api !== req.query.token)) {
        return res.status(401).send('Invalid token.');
      }

      // Create a private token with 10second expiry.
      const api_token = {
        email: user.email,
        roles: user.roles
      }
      
      api_token.signed = jwt.sign(
        api_token,
        process.env.SECRET,
        {
          expiresIn: 10
        });

      return next(req, res, api_token);
    }

    // Check admin_user privileges.
    if (access.key && token.key) return next(req, res, token);

    // Check admin_user privileges.
    if (access.admin_user && token.admin_user) return next(req, res, token);

    // Check admibn_workspace privileges.
    if (access.admin_workspace && token.admin_workspace) return next(req, res, token);

    // Continue if neither admin nor editor previliges are required.
    if (!access.admin_user && !access.admin_workspace) return next(req, res, token);    

    res.status(401).send('Invalid token.');

  });

};