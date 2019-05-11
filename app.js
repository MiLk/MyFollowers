const config    = require('config');
const express   = require('express');
const compression = require('compression');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose  = require('mongoose');
const routes    = require('./routes');

const app = express();
app.use(compression());
app.use(morgan('short'));
app.use(bodyParser.json());
app.use(express.static('public'));

routes(app);

const {port, mongodb} = config;
const runApp = () =>
    app.listen(port, () => console.log('MyFollowers is listening to :' + port));


mongoose.connect(mongodb, {useNewUrlParser: true, useCreateIndex: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', runApp);
