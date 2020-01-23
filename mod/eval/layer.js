module.exports = (req, res, next) => {

    req.params.layer = req.params.locale.layers[req.query.layer];
  
    if (!req.params.layer) {
      res.status(400);
      return next(new Error('Invalid layer.'));
    }
  
    next();
  
};