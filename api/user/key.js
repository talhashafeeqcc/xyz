const auth = require('../../mod/auth/handler');

module.exports = (req, res) => auth(req, res, handler, {
  login: true
});

async function handler(req, res, token){

  // Get user from ACL.
  var rows = await acl(`
    SELECT * FROM acl_schema.acl_table
    WHERE lower(email) = lower($1);`, [token.email]);
    
  if (rows instanceof Error) return res.redirect(process.env.DIR || '' + '/login?msg=badconfig');
  
  const user = rows[0];
  
  if (!user
    || !user.verified
    || !user.approved
    || user.blocked) return res.status(401).send(new Error('Invalid token'));
  
  // Create signed api_token
  const api_token = fastify.jwt.sign({
    email: user.email,
    roles: [],
    api: true
  });
  
  // Store api_token in ACL.
  var rows = await acl(`
    UPDATE acl_schema.acl_table SET api = '${api_token}'
    WHERE lower(email) = lower($1);`, [user.email]);
    
  if (rows instanceof Error) return res.redirect(process.env.DIR || '' + '/login?msg=badconfig');
  
  // Send ACL token.
  res.send(api_token);

}