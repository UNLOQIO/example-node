var unloq = require('unloq');
var config = require('../config.js');
/*
* This is the unsecure landing routes.
* */
module.exports = function(app) {
  var unloqApi = new unloq.Api(config.unloq);

  /**
  * This is just a small security middleware that checks if we have a user on the request session. If we do not, we do not pass.
  * */
  function securityMiddleware(req, res, next) {
    if(typeof req.session.user === 'undefined') {
      return res.redirect('/?expired=true');
    }
    next();
  }

  /**
  * This is the secured account endpoint that checks for the user data in the session and renders the required page.
  * */
  app.get('/account', securityMiddleware, function SecureAccount(req, res) {
    var user = req.session.user;
    res.render('account', {
      user: user
    });
  });

  /**
  * This endpoint is a helper one that will check if the session is expired or not.
  * */
  app.get('/ping', function(req, res) {
    if(typeof req.session.user === 'undefined') {
      return res.json({
        session: false
      });
    }
    res.json({
      session: true
    });
  });

  /**
  * Simple logout function that is called from the user's browser. This implies that a user is logged in when he does so.
  * */
  app.post('/logout', function(req, res) {
    if(!req.session.user) {
      return res.json({
        error: true,
        message: 'Session is not active.'
      });
    }
    req.session.destroy();
    return res.json({
      error: false
    });
  });

  /**
  * This endpoint does the heavy lifting, calling UNLOQ to authenticate a given user by his email. The process is split into two:
   * 1. Perform an authentication request and receive a token from UNLOQ.
   * 2. Confirm the token by giving the user's generated session id and the amount of time his/her session will be active.
   *    This step will return the actual user data (ID + email) and guarantees that the user is who he is.
  * */
  app.post('/login', function(req, res) {
    // We perform our UNLOQ authentication only with e-mail.
    var email = req.body.email || null;
    var SESSION_LIFETIME = 3600;  // number of seconds the session will last.
    if(!email) {
      return res.json({
        error: true,
        message: 'Invalid e-mail address'
      });
    }
    unloqApi.authenticate({
      email: email
    }).on('pending', function OnPending() {
      console.log('Notification reached user, awaiting input.');
    }).then(function(accessToken) {
      console.log('User accepted login, will create session.');
      // We need to generate a session ID.
      var sessionId = req.session.id;
      unloqApi.tokenData(accessToken, {
        session_id: sessionId,
        duration: SESSION_LIFETIME
      }).then(function(userData) {
        console.log('User just logged in.');
        console.log(userData);
        req.session.user = {
          id: userData.id,
          email: userData.email
        };
        return res.json({
          error: false
        });
      }).error(function(err) {
        console.log('Failed to retrieve user data, could not confirm access token.');
        console.log(err);
        return res.json({
          error: true,
          message: err.message || 'Something very very bad happened.'
        });
      });
    }).error(function(err) {
      console.log('Failed to login.');
      console.log(err);
      return res.json({
        error: true,
        message: err.message || 'Someting bad happened'
      });
    });
  });

  /**
  * This endpoint handles remote logout. After a user has logged in the app, he will receive the session id on his phone.
   * If he wants to logout from your application, he will call UNLOQ to proxy the logout request to this application.
   * The UNLOQ logout request will be a POST request on the logout URL set in the application's dashboard, having the following BODY parameters:
   *  - token - the access token received at the authentication request
   *  - sid - the session id that was previously passed when confirming the access token.
   *  - type - the type of action that we request termination to. Currently, this action is "authentication"
   * As a security measure, it will also contain two custom headers:
   *  - X-Api-Key: the application's  API key used in communication
   *
   * NOTE 2:
   * We only ask that you response with a JSON containing the key: "logout"
   *  {logout: true}
  * */
  app.post('/logout/unloq', function(req, res) {
    if(req.headers['x-api-key'] !== config.apiKey) {
      console.log('Received un-authorized UNLOQ logout request.');
      return res.end();
    }
    var sessionId = req.body.sid;
    console.log('Received UNLOQ logout for session: %s (%s)', sessionId, req.body.type);
    // We now need to destroy that session.
    app.session.destroy(sessionId);
    res.json({
      logout: true
    });
  });


};