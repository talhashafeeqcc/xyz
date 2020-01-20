const jwt_decode = require('jwt-decode');

module.exports = (req, res, next) => {
    
    req.params.token = req.query.token ?
        jwt_decode(req.query.token) :
        { access: 'public', roles: [] };

    next();

}