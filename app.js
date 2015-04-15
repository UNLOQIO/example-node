var express = require('express');
var bodyParser = require('body-parser');
var swig = require('swig');
var app = express();
var config = require('./config.js');
var sessionStore = new express.session.MemoryStore();

app.session = sessionStore;
app.engine('swig', swig.renderFile);
app.set('view engine', 'swig');
app.set('views', __dirname + '/views');
app.use(express.session({
  store: sessionStore,
  secret: 'secrethere',
  key: 'sess'
}));

if(process.env.NODE_ENV !== 'production') {
  swig.setDefaults({
    cache: false
  });
}

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

require('./routes/index')(app);
require('./routes/secure')(app);


app.listen(config.port || 3200, function() {
  console.log('UNLOQ example app listening on port %s', config.port);
});