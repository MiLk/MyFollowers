var config    = require('config')
  , express   = require('express')
  , mongoose  = require('mongoose')
  , routes    = require('./routes')
  ;

var app = express();
app.use(express.compress());
app.use(express.methodOverride());
app.use(express.bodyParser());
app.use(express.static(__dirname + '/public'));
app.use(app.router);

routes(app);

var runApp = function() {
  app.listen(config.port);
};

mongoose.connect(config.mongodb);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', runApp);
