module.exports = async (req, res, next) => {

    req.params.locale = env.workspace.locales[req.query.locale];
  
    if (!req.params.locale) {
      res.status(400);
      return next(new Error('Invalid locale.'));
    }
  
    next();
  
};