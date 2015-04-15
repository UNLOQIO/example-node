
/*
* This is the unsecure landing routes.
* */
module.exports = function(app) {
  app.get('/', function(req, res) {
    var isExpired = (req.query.expired === 'true' ? true : false);
    res.render('index', {
      expired: isExpired
    });
  });
};